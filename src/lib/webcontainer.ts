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
import semver from 'semver';
import { tick } from 'svelte';
import { get, writable, type Writable } from 'svelte/store';
import { stringify } from './components/parsers';
import {
	assert_diagnostic,
	diagnostic_store,
	is_sveltecheck_running,
} from './stores/editor_errors_store';
import { expand_path } from './stores/expanded_paths';
import { file_status, is_repl_to_save, repl_name } from './stores/repl_id_store';
import { close_all_tabs, current_tab, open_file, tabs } from './tabs';
import { actionable } from './toast';
import { MapOfSet, deferred_promise, version_compare } from './utils';

/**
 * Used to throw an useful error if you try to access any function before initing
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
	recursive_warning_proxy_traps,
);

const { subscribe, set } = writable({
	webcontainer_url: '',
	status: 'booting' as 'booting' | 'waiting' | 'server_closed' | 'running',
	iframe_path: '/',
	process_writer: null as WritableStreamDefaultWriter<string> | null,
	running_process: null as WebContainerProcess | null,
	is_jsh_listening: false,
});

type WebcontainerStoreType = Parameters<typeof subscribe>['0'] extends (
	value: infer ActualType,
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
 * we can use this to check if we are already listening to fs
 */
export const listening_for_fs = {
	subscribe: listening_for_fs_store.subscribe,
};

type FSChangedCallback = (path: string) => void;

type FSChangedEvent = 'creation' | 'deletion';

const fs_changes_callbacks = new MapOfSet<FSChangedEvent, Set<FSChangedCallback>>();

async function listen_for_files_changes() {
	listening_for_fs_store.set(false);
	const to_ignore = IGNORE_LIST.flatMap((IGNORE) => ['-i', `"${IGNORE}"`]);
	const process = await webcontainer_instance.spawn('npx', [
		'-y',
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
						fs_changes_callbacks.get('creation').forEach((callbacks) => {
							callbacks(path);
						});
						add_file_in_store(files_store, path, '', true);
					} else if (command === 'unlink') {
						try {
							fs_changes_callbacks.get('deletion').forEach((callbacks) => {
								callbacks(path);
							});
							delete_file_from_store(files_store, path);
						} catch (e) {
							/* empty */
						}
					}
				}
			},
		}),
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
	create_if_not_exist = false,
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

const JSH_LISTENING_STRING = '\u001b[1G\u001b[0J\u001b[35m❯\u001b[39m \u001b[3G';

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
					// if data includes ❯ and jsh it's already listening it finished a command
					// so we can get the next one and run it if there's one. If there's no we set
					// is_jsh_listening to true
				} else if (data.includes(JSH_LISTENING_STRING) && already_listening) {
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
				if (data.startsWith('svelte:inspector')) {
					const file_to_open = data
						.split(' ')
						.pop()!
						.trim()
						.replace(webcontainer_instance.workdir, '.') as `./${string}`;
					const files = get(files_store);
					if (does_file_exist(files, file_to_open)) {
						open_file(file_to_open);
					}
				}
				if (!data.startsWith('svelte:inspector')) {
					terminal.write(data);
				}
			},
		}),
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
		}),
	);
	return process;
}

/**
 * I went trough the sveltekit codebase and since the creation of the file
 * there are only those two instances of of this function. By listing them all we should be set
 * for older projects and also if that function ever changes we would not replace that anymore.
 */
const broken_functions_map = new Map([
	[
		`function fix_stack_trace(error) {
		vite.ssrFixStacktrace(error);
		return error.stack;
	}`,
		`function fix_stack_trace(error) {
			try{
				vite.ssrFixStacktrace(error);
			}catch(e){}
			return error.stack;
		}`,
	],
	[
		`function fix_stack_trace(error) {
		return error.stack ? vite.ssrRewriteStacktrace(error.stack) : error.stack;
	}`,
		`function fix_stack_trace(error) {
		try{
			return error.stack ? vite.ssrRewriteStacktrace(error.stack) : error.stack;
		}catch(_e){
			return error.stack;
		}
	}`,
	],
	[
		`function fix_stack_trace(stack) {
		return stack ? vite.ssrRewriteStacktrace(stack) : stack;
	}`,
		`function fix_stack_trace(stack) {
		try{
			return stack ? vite.ssrRewriteStacktrace(stack) : stack;
		}catch(_e){
			return stack;
		}
	}`,
	],
]);

/**
 * There's a weird bug right now where the function to fix stack traces in the vite dev
 * server for sveltekit get's called twice causing the dev server to crash if there's an error
 * on the server. To fix this we momentarily replace that node module file and we try/catch
 * the call to fix_stack_trace. Let's hope in the future we get to delete this weird hack
 */
async function fix_vite_ssr_rewrite() {
	const file_to_fix = './node_modules/@sveltejs/kit/src/exports/vite/dev/index.js';
	try {
		let sveltekit_vite_dev = await webcontainer_instance.fs.readFile(file_to_fix, 'utf-8');
		for (const [old, replacement] of broken_functions_map.entries()) {
			sveltekit_vite_dev = sveltekit_vite_dev.replace(old, replacement);
		}
		await webcontainer_instance.fs.writeFile(file_to_fix, sveltekit_vite_dev);
	} catch (_) {
		/** empty */
	}
}
/**
 * Inject a window.parent.postMessage in the navigate function of the sveltekit client to get
 * a message when sveltekit navigate inside the iframe. This works for forms, links and goto.
 */
async function inject_postmessage() {
	// weird regex i know but this basically get the navigated function find the if(started) check
	// inside there capturing the value in the parenthesis of stores.navigating.set
	const navigate_regex =
		/function navigate\((?:.|\n|\n\r)*?\(started\)(?:.|\n|\n\r)*?(?:stores\.navigating.set\(((?:.|\n|\n\r)*?)\)).+\n/m;
	const file_to_fix = './node_modules/@sveltejs/kit/src/runtime/client/client.js';
	try {
		// read the client file
		let sveltekit_runtime_client = await webcontainer_instance.fs.readFile(file_to_fix, 'utf-8');
		// replace the regex injecting a window.parent.postMessage before setting the navigating store
		const match = sveltekit_runtime_client.match(navigate_regex);
		if (match && match.index) {
			sveltekit_runtime_client =
				"import { get as sveltelab_get } from 'svelte/store';\n" +
				sveltekit_runtime_client.substring(0, match[0].length + match.index) +
				"\nwindow?.parent?.postMessage?.(JSON.stringify(sveltelab_get(stores.navigating)),'*');\n" +
				sveltekit_runtime_client.substring(match[0].length + match.index);
		}
		await webcontainer_instance.fs.writeFile(file_to_fix, sveltekit_runtime_client);
	} catch (_) {
		/** empty */
	}
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
		}),
	);
	await check_version_process.exit;
	// check if svelte-check is present in `npm list` and extrapolate
	// the version
	const svelte_check_match = npm_list_output.match(
		/svelte-check@(?<major>\d+).(?<minor>\d+).(?<patch>\d+)/,
	);
	if (svelte_check_match && svelte_check_match.groups) {
		// svelte-check is present, we check if it's the correct version
		const { major, minor, patch } = svelte_check_match.groups;
		if (version_compare('3.4.3', `${+major}.${+minor}.${+patch}`) === 1) {
			// if it's an older version we set available to false
			// ad we prompt the user to update
			available = false;
			actionable(
				'Your version of svelte-check is older than the required 3.4.3 to run the diagnostics...would you like to update?',
				async () => {
					const update_svelte_check_process = await spawn_process_and_show_output(
						'npm install svelte-check@latest -D',
					);
					const result = await update_svelte_check_process.exit;
					if (result === 0) {
						run_svelte_check();
					}
				},
				'Update',
			);
		}
		available = true;
	} else {
		// no svelte-check found, we set available to false and show an actionable
		// toast asking them to install it
		available = false;
		actionable(
			'We use svelte-check to provide diagnostics and we found no svelte-check...would you like to install it?',
			async () => {
				// if they decide to install we proceed to install and if the installation
				// is successful we run svelte-check again
				const install_svelte_check_process = await spawn_process_and_show_output(
					'npm install svelte-check@latest -D',
				);
				const result = await install_svelte_check_process.exit;
				if (result === 0) {
					run_svelte_check();
				}
			},
			'Install',
		);
	}

	if (!available) return;

	const process = await webcontainer_instance.spawn('npx', [
		'-y',
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
		}),
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

function starts_with_dot_slash(str: string): str is `./${string}` {
	return str.startsWith('./');
}
/**
 * The actual webcontainer store with useful methods
 */
export const webcontainer = {
	subscribe,
	async sync_file_system() {
		files_store.set(await get_tree_from_container());
	},
	/** truth before boot */
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
					"You are trying to init the webcontainer multiple times and that's not permitted. Check your code!",
				);
			}
			return;
		}
		webcontainer_instance = await WebContainer.boot();
		webcontainer_instance.on('server-ready', (port, url) => {
			// we run svelte-check after the server is ready
			// to avoid not having the updated types from the sveltekit dev server
			run_svelte_check();
			merge_state({ webcontainer_url: url, status: 'running' });
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
		const search_params = new URLSearchParams(window.location.search);
		const files_to_open_string = search_params.get('files') ?? './src/routes/+page.svelte';
		const files_to_open = files_to_open_string.split(',');

		for (const file_to_open of files_to_open) {
			if (!starts_with_dot_slash(file_to_open)) continue;
			// we do this here to avoid opening a non existing file
			if (does_file_exist(files, file_to_open)) {
				open_file(file_to_open);
			}
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
		await run_command('export PATH=$PATH:/home');
		await run_command('echo "echo svelte:inspector \\$2" > /home/inspector');
		await run_command('chmod 777 /home/inspector');
		await run_command('export EDITOR=inspector');
		terminal.clear();
		await webcontainer.install_dependencies();
		await fix_vite_ssr_rewrite();
		await inject_postmessage();
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
		await run_command('npm install');
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
		try {
			await webcontainer_instance.fs.mkdir(path, {
				recursive: true,
			});
		} catch (e) {
			add_file_in_store(files_store, path, '', true);
		}
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
	/**
	 * @param origin could be a file or folder with trailing `/`
	 * @param destination should always a folder with trailing `/`
	 */
	async move_file(origin: string, destination: string) {
		try {
			const { status } = get({ subscribe });
			if (status === 'booting') return;

			const process = await webcontainer.spawn('mv', [origin, destination]);
			process.output.pipeTo(
				new WritableStream({
					write(chunk) {
						terminal.write(chunk);
					},
				}),
			);
			await process.exit;

			webcontainer.sync_file_system();
			expand_path(destination.slice(0, -1));

			// fixup tabs and current_tab
			const origin_is_file = !origin.endsWith('/');
			const file_name = origin_is_file ? origin.split('/').pop() : '';
			if (!origin_is_file) {
				origin = origin.split('/').slice(0, -2).join('/') + '/';
			}
			tabs.update(($tabs) => $tabs.map((t) => t.replace(origin, destination + file_name)));
			current_tab.update(($current_tab) => $current_tab.replace(origin, destination + file_name));
		} catch (e) {
			console.error(e);
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
	on_fs_change(event: FSChangedEvent, cb: FSChangedCallback) {
		fs_changes_callbacks.get(event).add(cb);
		return () => {
			fs_changes_callbacks.get(event).delete(cb);
		};
	},
	check_file_exist(path: `./${string}`) {
		return does_file_exist(get(files), path);
	},
};

async function get_tree_from_container(as_string = true): Promise<FileSystemTree> {
	const root = await webcontainer_instance.fs.readdir('/', { withFileTypes: true });
	return get_tree(root, '/', as_string);
}

const decoder = new TextDecoder();
async function get_tree(
	dir: DirEnt<string>[],
	path: string,
	as_string: boolean,
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
					as_string,
				),
			};
		}
	}
	return tree;
}

const IGNORE_LIST = ['.svelte-kit', 'node_modules'];
