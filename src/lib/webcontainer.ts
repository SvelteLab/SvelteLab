import { dev } from '$app/environment';
import { get_file_from_path, get_subtree_from_path, is_dir } from '$lib/file_system';
import { terminal } from '$lib/terminal';
import {
	WebContainer,
	type DirEnt,
	type FileSystemTree,
	type WebContainerProcess,
} from '@webcontainer/api';
import { compressToEncodedURIComponent } from 'lz-string';
import { tick } from 'svelte';
import { get, writable, type Writable } from 'svelte/store';
import { stringify } from './components/parsers';
import {
	assert_diagnostic,
	diagnostic_store,
	is_sveltecheck_running,
} from './stores/editor_errors_store';
import { file_status, is_repl_to_save, repl_name } from './stores/repl_id_store';
import { close_all_tabs, open_file } from './tabs';
import { deferred_promise, version_compare } from './utils';
import { actionable } from './toast';

/**
 * Used to throw an useful error if you try to access any function befor initing
 * the web container.
 */
const recursive_warning_proxy_traps: ProxyHandler<never> = {
	get() {
		return new Proxy(new Function(), recursive_warning_proxy_traps);
	},
	apply() {
		throw new Error('You have to init the webcontainer before using it.');
	},
};

/**
 * This start as the warning Proxy and it will later be substitute with the actual instance upon
 * initialization. This is so we can avoid checking for the webcontainer instance presence
 * in every method.
 */
let webcontainer_instance = new Proxy<WebContainer>(
	{} as WebContainer,
	recursive_warning_proxy_traps
);

const { subscribe, set } = writable({
	webcontainer_url: '',
	status: 'booting' as 'booting' | 'waiting' | 'server_closed',
	iframe_path: '/',
	process_writer: null as WritableStreamDefaultWriter<string> | null,
	running_process: null as WebContainerProcess | null,
	is_jsh_listening: false,
});

type WebcontainerStoreType = Parameters<typeof subscribe>['0'] extends (
	value: infer ActualType
) => unknown
	? ActualType
	: never;

async function merge_state(state: Partial<WebcontainerStoreType>) {
	const previous_state = get({ subscribe });
	set({
		...previous_state,
		...state,
	});
}

/**
 * An utility function to run a command on the webcontainer instance as a string
 * it will automatically split the command by it's args and pipe every log to the
 * logs array.
 * @param {string} cmd a string representing a command you want to run
 * @param {()=>void} [callback] an optional callback to run when the command finishes
 */
function run_command(cmd: string) {
	const wc_store = get({ subscribe });
	// we get the writer from the store
	const shell_writer = wc_store.process_writer;
	// if it's already listening we write the passed in command
	// otherwise we queue it
	const { resolve, promise: command_promise } = deferred_promise();
	if (shell_writer && wc_store.is_jsh_listening) {
		shell_writer.write(cmd + '\r');
		jsh_finish_queue.add(resolve);
	} else {
		jsh_queue.add({ cmd, callback: resolve });
	}
	return command_promise;
}

const listening_for_fs_store = writable(false);

/**
 * we can use this to check if we are already lstening to fs
 */
export const listening_for_fs = {
	subscribe: listening_for_fs_store.subscribe,
};

async function listen_for_files_changes() {
	listening_for_fs_store.set(false);
	const to_ignore = IGNORE_LIST.flatMap((IGNORE) => ['-i', `"${IGNORE}"`]);
	const process = await webcontainer_instance.spawn('npx', [
		'chokidar-cli',
		'*',
		'**/*',
		...to_ignore,
	]);
	process.output.pipeTo(
		new WritableStream({
			write(data) {
				if (data.startsWith('success Install finished')) {
					listening_for_fs_store.set(true);
				}
				const matches = data.match(/(?<command>(?:unlink|add)):(?<route>.*)/);
				if (matches) {
					const { command, route } = matches.groups as {
						command: 'unlink' | 'add';
						route: string;
					};
					const path = `./${route}`;
					diagnostic_store.prepare_for_new_check();
					if (command === 'add') {
						add_file_in_store(files_store, path, '', true);
					} else if (command === 'unlink') {
						try {
							delete_file_from_store(files_store, path);
						} catch (e) {
							/* empty */
						}
					}
				}
			},
		})
	);
	process.exit.then(listen_for_files_changes);
}

/**
 * Readable store for the file system tree, we duplicate this so that
 * the file system tree does not have to re-evaluate every keystroke
 */
const files_store = writable<FileSystemTree>();

export const files = {
	subscribe: files_store.subscribe,
};

function add_file_in_store(
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	store: Writable<any>,
	path: string,
	contents: string,
	create_if_not_exist = false
) {
	//get the file content from the path
	const subtree = get_file_from_path(path, get(store), create_if_not_exist);
	//update the in memory store
	subtree.contents = contents;
	//trigger rerender
	store.update((value) => value);
	is_repl_to_save.set(true);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function delete_file_from_store(store: Writable<any>, path: string) {
	const split_path = path.split('/');
	const last_part = split_path.pop();
	const actual_path = split_path.length === 1 ? `${split_path[0]}/` : split_path.join('/');
	const subtree = get_subtree_from_path(actual_path, get(store));
	if (subtree) {
		if (last_part) {
			//delete the last part of the path
			delete subtree[last_part];
			//trigger rerender
			store.update((value) => value);
		}
	}
	is_repl_to_save.set(true);
}

const init_callbacks = new Set<() => void>();

async function clear_webcontainer_fs() {
	const main_dir = await webcontainer_instance.fs.readdir('./');
	for (const file of main_dir) {
		await webcontainer_instance.fs.rm(`./${file}`, { recursive: true });
	}
}

// the first queue is used when the user or we try to run a command
// while jsh is not listening yet, we queue the command write it to
// the terminal as soon as jsh is ready
const jsh_queue = new Set<{ cmd: string; callback?: () => void }>();
// the second queue is to have callbacks for when a command finishes
// for example to launch the chokidar listener after the npm i
const jsh_finish_queue = new Set<() => void>();

async function launch_jsh() {
	// we launch the shell
	const jsh_process = await webcontainer_instance.spawn('jsh', {
		terminal: {
			cols: terminal.cols,
			rows: terminal.rows,
		},
	});
	// we pipe the output of the process to a new writable stream that
	// write to the terminal
	jsh_process.output.pipeTo(
		new WritableStream({
			async write(data) {
				const already_listening = get({ subscribe }).is_jsh_listening;
				// if data includes ❯ and jsh is not already listening
				// we sync the store and eventually run the next command
				// in the queue
				if (data.includes('❯') && !already_listening) {
					merge_state({
						is_jsh_listening: true,
					});
					files_store.set(await get_tree_from_container());
					const command = jsh_queue.values().next().value as { cmd: string; callback?: () => void };
					if (command) {
						run_command(command.cmd);
						if (command.callback) {
							jsh_finish_queue.add(command.callback);
						}
						jsh_queue.delete(command);
					}
					// if data includes \r and jsh it's already listening
					// a new command is probably being run so we set the store
				} else if (data.includes('❯') && already_listening) {
					jsh_finish_queue.forEach((callback) => callback());
					jsh_finish_queue.clear();
					const command = jsh_queue.values().next().value as { cmd: string; callback?: () => void };
					if (command) {
						run_command(command.cmd);
						if (command.callback) {
							jsh_finish_queue.add(command.callback);
						}
						jsh_queue.delete(command);
					}
					merge_state({
						is_jsh_listening: !command,
					});
				}
				terminal.write(data);
			},
		})
	);
	// get the input writer and store it in the store
	const shell_writer = jsh_process.input.getWriter();
	merge_state({
		running_process: jsh_process,
		process_writer: shell_writer,
	});

	// add listener on the terminal to pipe that to the actual process
	const terminal_writer = terminal.onData((data) => {
		shell_writer.write(data);
	});

	// wait for the process to exit
	const exit_code = await jsh_process.exit;
	// reset the store, clear terminal and dispose writer
	merge_state({
		process_writer: null,
		running_process: null,
		is_jsh_listening: false,
	});
	terminal.clear();
	terminal_writer.dispose();
	// if the user type the exit command we
	// relaunch the shell...the code will be 143 when we kill the process
	if (exit_code === 0) {
		launch_jsh();
	} else {
		// if we kill the process we also clear the queue
		jsh_queue.clear();
		jsh_finish_queue.clear();
	}
}

function parse_svelte_check(chunk: string) {
	// the current log is a timestamp followed by the actual log
	// this regex simply match against multiple numbers and extract the
	// rest of the line in a group called diagnostic
	const result = chunk.trim().match(/^\d+\s(?<diagnostic>.*)$/);
	if (result && result.groups) {
		try {
			const diagnostic = JSON.parse(result.groups.diagnostic);
			diagnostic.type = diagnostic?.type?.toLowerCase();
			assert_diagnostic(diagnostic);
			diagnostic.filename = `./${diagnostic?.filename}`;
			diagnostic.start.line++;
			diagnostic.end.line++;
			return diagnostic;
		} catch (e) {
			/* empty */
		}
	}
}

async function spawn_process_and_show_output(cmd: string) {
	const [main_command, ...args] = cmd.split(' ');
	const process = await webcontainer_instance.spawn(main_command, args);
	process.output.pipeTo(
		new WritableStream({
			write(chunk) {
				terminal.write(chunk);
			},
		})
	);
	return process;
}

async function run_svelte_check() {
	if (is_sveltecheck_running) return;
	const check_version_process = await webcontainer_instance.spawn('npm', ['list']);
	let available = false;
	let npm_list_output = '';
	check_version_process.output.pipeTo(
		new WritableStream({
			write(chunk) {
				npm_list_output += chunk;
			},
		})
	);
	await check_version_process.exit;
	// check if svelte-check is present in `npm list` and extrapolate
	// the version
	const svelte_check_match = npm_list_output.match(
		/svelte-check@(?<major>\d+).(?<minor>\d+).(?<patch>\d+)/
	);
	if (svelte_check_match && svelte_check_match.groups) {
		// svelte-check is present, we check if it's the correct version
		const { major, minor, patch } = svelte_check_match.groups;
		if (version_compare('3.4.3', `${+major}.${+minor}.${+patch}`) === 1) {
			// if it's an older version we set available to false
			// ad we prompt the user to update
			available = false;
			actionable(
				'Your version of svelte-check is older than the required 3.4.3...would you like to update?',
				async () => {
					const update_svelte_check_process = await spawn_process_and_show_output(
						'npm install svelte-check@latest'
					);
					const result = await update_svelte_check_process.exit;
					if (result === 0) {
						run_svelte_check();
					}
				},
				'Update'
			);
		}
		available = true;
	} else {
		// no svelte-check found, we set available to false and show an actionable
		// toast asking them to install it
		available = false;
		actionable(
			'No svelte-check found...would you like to install it?',
			async () => {
				// if they decide to install we proceed to install and if the installation
				// is successful we run svelte-check again
				const install_svelte_check_process = await spawn_process_and_show_output(
					'npm install svelte-check@latest'
				);
				const result = await install_svelte_check_process.exit;
				if (result === 0) {
					run_svelte_check();
				}
			},
			'Install'
		);
	}

	if (!available) return;

	const process = await webcontainer_instance.spawn('npx', [
		'svelte-check',
		'--watch',
		'--output',
		'machine-verbose',
	]);
	diagnostic_store.set_is_running(true);
	process.output.pipeTo(
		new WritableStream({
			write(chunk) {
				if (chunk.toLowerCase().includes('completed')) {
					diagnostic_store.resolve();
				}
				const result = parse_svelte_check(chunk);
				if (result) {
					diagnostic_store.push_diagnositc(result);
				}
			},
		})
	);
	process.exit.then(() => {
		diagnostic_store.set_is_running(false);
		run_svelte_check();
	});
}

function does_file_exist(files: FileSystemTree, path: `./${string}`) {
	const parts = path.split('/');
	// throw the dot away
	parts.shift();
	const file = parts.pop() ?? '';
	let subtree = files;
	for (const part of parts) {
		const current_check = subtree[part];
		if (!current_check || !is_dir(current_check)) return false;
		subtree = current_check.directory;
	}
	return !!subtree[file];
}

async function read_file(path: string): Promise<string>;
async function read_file(path: string, as_string: false): Promise<Uint8Array>;
async function read_file(path: string, as_string: true): Promise<string>;
async function read_file(path: string, as_string: boolean): Promise<Uint8Array | string>;
async function read_file(path: string, as_string = true) {
	try {
		if (as_string) {
			return webcontainer_instance.fs.readFile(path, 'utf8');
		}
		return webcontainer_instance.fs.readFile(path);
	} catch (e) {
		// use store instead
		let contents = get_file_from_path(path, get(files_store)).contents;
		if (typeof contents !== 'string') {
			contents = decoder.decode(contents);
		}
		return contents;
	}
}

/**
 * Ther actual webcontainer store with useful methods
 */
export const webcontainer = {
	subscribe,
	async sync_file_system() {
		files_store.set(await get_tree_from_container());
	},
	async set_file_system(files: FileSystemTree) {
		files_store.set(files);
	},
	/**
	 * init the webcontainer and mount the files
	 */
	async init() {
		if (webcontainer_instance instanceof WebContainer) {
			if (dev) {
				console.warn(
					"You are trying to init the webcontainer multiple times and that's not permitted. Check your code!"
				);
			}
			return;
		}
		webcontainer_instance = await WebContainer.boot();
		webcontainer_instance.on('server-ready', (port, url) => {
			// we run svelte-check after the server is ready
			// to avoid not having the updated types from the sveltekit dev server
			run_svelte_check();
			merge_state({ webcontainer_url: url });
			webcontainer_instance.on('port', (closed_port: number) => {
				if (port === closed_port) {
					merge_state({ webcontainer_url: '', status: 'server_closed' });
				}
			});
		});
	},
	/**
	 * Mount some files in the filesystem
	 */
	async mount_files() {
		await clear_webcontainer_fs();
		const files = get(files_store);
		await webcontainer_instance.mount(files);
		// avoid ghost files from previous projects
		close_all_tabs();
		await tick();
		// we do this here to avoid opening a non existing file
		if (does_file_exist(files, './src/routes/+page.svelte')) {
			open_file('./src/routes/+page.svelte');
		}
		init_callbacks.forEach((callback) => {
			if (typeof callback === 'function') {
				callback();
			}
		});
		init_callbacks.clear();
		// on mount we launch the shell
		launch_jsh();
		merge_state({ status: 'waiting' });
		await webcontainer.install_dependencies();
		webcontainer.run_dev_server();
	},
	/**
	 * Register a callback for the webcontainer boots.
	 * @param callback the callback that will be called when the webcontainer boots
	 * @returns The cleanup function to unregister the callback
	 */
	on_init(callback: () => void) {
		init_callbacks.add(callback);
		return () => {
			init_callbacks.delete(callback);
		};
	},
	/**
	 * Write a file inside the file system of the webcontainer.
	 * If the file does not exist it throws.
	 * @param path the path to a file in the virtual file system to update
	 * @param content The content of the file to be written
	 */
	update_file(path: string, content: string) {
		const update = () => {
			webcontainer_instance.fs.writeFile(path, content);
			diagnostic_store.prepare_for_new_check();
			is_repl_to_save.set(true);
			file_status.set_file_edited_status(path, true);
		};
		if (webcontainer_instance instanceof WebContainer) {
			update();
		} else {
			init_callbacks.add(update);
		}
	},
	/**
	 * Run the initial npm install
	 * @returns a promise that fulfill when the command has finished to run
	 */
	async install_dependencies() {
		const package_json = await this.read_package_json();
		// if there are no dependencies to install just return 0 as the
		// correct exit code
		if (!(package_json?.dependencies || package_json?.devDependencies)) {
			listen_for_files_changes();
			return Promise.resolve(0);
		}
		await run_command('npm install --verbose');
		listen_for_files_changes();
	},
	/**
	 * Run the dev server and register a callback on "server-ready"
	 * to update the iframe url;
	 */
	async run_dev_server() {
		const package_json = await this.read_package_json();
		// if there is no dev script just return 0 as the
		// correct exit code
		if (!package_json?.scripts?.dev) {
			terminal.write('no dev script found, run whatever you want...\n');
			return 0;
		}
		return run_command('npm run dev');
	},
	run_command,
	async spawn(command: string, args: string[]) {
		return webcontainer_instance.spawn(command, args);
	},
	async add_file(path: string, content: string | Uint8Array) {
		await webcontainer_instance.fs.writeFile(path, content);
		diagnostic_store.prepare_for_new_check();
		//if we are not already listening we can add the file in store ourself
		if (!get(listening_for_fs_store)) {
			add_file_in_store(files_store, path, '', true);
		}
	},
	async add_folder(path: string) {
		await webcontainer_instance.fs.mkdir(path, {
			recursive: true,
		});
		get_subtree_from_path(path, get(files_store), true);
		//trigger rerender
		files_store.update((value) => value);
		is_repl_to_save.set(true);
	},
	async delete_file(path: string) {
		await webcontainer_instance.fs.rm(path, {
			recursive: true,
		});
		try {
			delete_file_from_store(files_store, path);
		} catch (e) {
			/* empty */
		}
	},
	read_file,
	async read_package_json() {
		try {
			const file = await this.read_file('./package.json');
			return JSON.parse(file);
		} catch (e) {
			return '';
		}
	},
	async get_share_url() {
		const container_tree = await get_tree_from_container(false);
		// we delete package-lock because it's not needed
		// and it bloat the url
		delete container_tree['package-lock.json'];
		const url = new URL(window.location.href);
		url.pathname = '';
		const encoded = compressToEncodedURIComponent(stringify(container_tree));
		const url_search_params = new URLSearchParams();
		url_search_params.set('code', encoded);
		url.hash = url_search_params.toString();
		return url;
	},

	set_iframe_path(iframe_path: string) {
		merge_state({ iframe_path });
	},
	async save_as_zip() {
		// lazy load the library loading since it's not a common usage
		// eslint-disable-next-line @typescript-eslint/naming-convention
		const JSZip = (await import('jszip')).default;
		const zip = new JSZip();
		const current_tree = await get_tree_from_container(false);
		const traverse = (tree: FileSystemTree, path: string) => {
			const files_and_folders = Object.keys(tree);
			for (const file of files_and_folders) {
				const entry = tree[file];
				const current_path = `${path}${file}`;
				if (is_dir(entry)) {
					zip.folder(current_path);
					traverse(entry.directory, `${current_path}/`);
					continue;
				}
				zip.file(current_path, entry.file.contents);
			}
		};
		traverse(current_tree, '');
		const base_64 = await zip.generateAsync({ type: 'base64' });
		const a = document.createElement('a');
		a.href = 'data:application/zip;base64,' + base_64;
		a.download = `${get(repl_name)}.zip`;
		a.click();
	},
	get_tree_from_container,
};

async function get_tree_from_container(as_string = true): Promise<FileSystemTree> {
	const root = await webcontainer_instance.fs.readdir('/', { withFileTypes: true });
	return get_tree(root, '/', as_string);
}

const decoder = new TextDecoder();
async function get_tree(
	dir: DirEnt<string>[],
	path: string,
	as_string: boolean
): Promise<FileSystemTree> {
	const tree: FileSystemTree = {};
	for (const node of dir) {
		const node_path = path + node.name;
		if (node.isFile()) {
			const raw_data = await webcontainer_instance.fs.readFile(node_path);
			let contents: string | Uint8Array = raw_data;
			if (as_string) {
				contents = decoder.decode(raw_data); // convert to POJO
			}
			tree[node.name] = {
				file: {
					contents,
				},
			};
		} else if (node.isDirectory() && !IGNORE_LIST.includes(node.name)) {
			tree[node.name] = {
				directory: await get_tree(
					await webcontainer_instance.fs.readdir(node_path, { withFileTypes: true }),
					node_path + '/',
					as_string
				),
			};
		}
	}
	return tree;
}

const IGNORE_LIST = ['.svelte-kit', 'node_modules'];
