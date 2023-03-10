import { dev } from '$app/environment';
import { get_file_from_path, get_subtree_from_path } from '$lib/file_system';
import { terminal } from '$lib/terminal';
import {
	WebContainer,
	type DirEnt,
	type FileSystemTree,
	type WebContainerProcess
} from '@webcontainer/api';
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';
import { get, writable, type Writable } from 'svelte/store';
import { files as default_files } from './files';

const initial_files = default_files as FileSystemTree;

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
	}
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
	webcontainer_url: './loading',
	iframe_path: '/',
	process_writer: null as WritableStreamDefaultWriter<string> | null,
	running_process: null as WebContainerProcess | null,
	is_jsh_listening: false
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
		...state
	});
}

/**
 * An utility function to run a command on the webcontainer instance as a string
 * it will automatically split the command by it's args and pipe every log to the
 * logs array.
 * @param cmd a string representing a command you want to run
 * @returns the exit code of the command
 */
function run_command(cmd: string) {
	const wc_store = get({ subscribe });
	// we get the writer from the store
	const shell_writer = wc_store.process_writer;
	// if it's already listening we write the passed in command
	// otherwise we queue it
	if (shell_writer && wc_store.is_jsh_listening) {
		shell_writer.write(cmd + '\n');
	} else {
		jsh_queue.add(cmd);
	}
}

const listening_for_fs_store = writable(false);

/**
 * we can use this to check if we are already lstening to fs
 */
export const listening_for_fs = {
	subscribe: listening_for_fs_store.subscribe
};

async function listen_for_files_changes() {
	listening_for_fs_store.set(false);
	const to_ignore = IGNORE_LIST.flatMap((IGNORE) => ['-i', `"${IGNORE}"`]);
	const process = await webcontainer_instance.spawn('npx', [
		'chokidar-cli',
		'*',
		'**/*',
		...to_ignore
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
			}
		})
	);
	process.exit.then(listen_for_files_changes);
}

/**
 * Readable store for the file system tree, we duplicate this so that
 * the file system tree does not have to re-evaluate every keystroke
 */
const files_store = writable(structuredClone(initial_files));

export const files = {
	subscribe: files_store.subscribe
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
}

const init_callbacks = new Set<() => void>();

/**
 * Function to get the files to mount based on the to_mount
 * argument. The order is the following:
 * - If there's a file system passed in it will just return that
 * - If there's not a file system passed in and there's the hash
 * it will return the decoded hash
 * - If there's not a fole system and there's not an hash it will
 * return the initial files.
 */
function get_files_to_mount(to_mount?: FileSystemTree) {
	const hash = window?.location?.hash?.substring?.(1);
	if (!to_mount && hash) {
		const url_search_params = new URLSearchParams(hash);
		const code = url_search_params.get('code');
		if (code) {
			const project = decompressFromEncodedURIComponent(code);
			try {
				to_mount = JSON.parse(project);
			} catch (e) {
				/* empty */
			}
		}
	}
	return to_mount ?? initial_files;
}

async function remove_all_files() {
	const main_dir = await webcontainer_instance.fs.readdir('./');
	for (const file of main_dir) {
		await webcontainer_instance.fs.rm(`./${file}`, { recursive: true });
	}
}

const jsh_queue = new Set<string>();

async function launch_jsh() {
	// we launch the shell
	const jsh_process = await webcontainer_instance.spawn('jsh', {
		terminal: {
			cols: terminal.cols,
			rows: terminal.rows
		}
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
						is_jsh_listening: true
					});
					files_store.set(await get_tree_from_container());
					const command = jsh_queue.values().next().value;
					if (command) {
						run_command(command);
						jsh_queue.delete(command);
					}
					// if data includes \r and jsh it's already listening
					// a new command is probably being run so we set the store
				} else if (data.includes('\r') && already_listening) {
					merge_state({
						is_jsh_listening: false
					});
				}
				terminal.write(data);
			}
		})
	);
	// get the input writer and store it in the store
	const shell_writer = jsh_process.input.getWriter();
	merge_state({
		running_process: jsh_process,
		process_writer: shell_writer
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
		is_jsh_listening: false
	});
	terminal.clear();
	terminal_writer.dispose();
	// if the user type the exit command we
	// relaunch the shell...the code will be 143 when we kill the process
	if (exit_code === 0) {
		launch_jsh();
	}
}

/**
 * Ther actual webcontainer store with useful methods
 */
export const webcontainer = {
	subscribe,
	/**
	 * init the webcontainer and mount the files
	 */
	async init(to_mount?: FileSystemTree) {
		if (webcontainer_instance instanceof WebContainer) {
			if (dev) {
				console.warn(
					"You are trying to init the webcontainer multiple times and that's not permitted. Check your code!"
				);
			}
			return;
		}
		//we just get this files to already show the files in the blorred background
		to_mount = get_files_to_mount(to_mount);
		if (to_mount) {
			files_store.set(structuredClone(to_mount));
		}
		webcontainer_instance = await WebContainer.boot();
		webcontainer_instance.on('server-ready', (port, url) => {
			merge_state({ webcontainer_url: url });
			webcontainer_instance.on('port', (closed_port: number) => {
				if (port === closed_port) {
					merge_state({ webcontainer_url: './error' });
				}
			});
		});
	},
	/**
	 * Mount some files in the filesystem
	 * @param to_mount the file tree to mount
	 * @returns a promise that resolves when the file are mounted
	 */
	async mount_files(to_mount?: FileSystemTree) {
		to_mount = get_files_to_mount(to_mount);
		if (to_mount) {
			files_store.set(structuredClone(to_mount));
		}
		await remove_all_files();
		const mount_promise = webcontainer_instance.mount(to_mount ?? initial_files);
		merge_state({
			webcontainer_url: './loading'
		});
		init_callbacks.forEach((callback) => {
			if (typeof callback === 'function') {
				callback();
			}
		});
		init_callbacks.clear();
		// on mount we launch the shell
		launch_jsh();
		return mount_promise;
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
		webcontainer_instance.fs.writeFile(path, content);
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
		run_command('npm install --verbose');
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
	/**
	 * Saves the container file system to local storage
	 */
	async save(): Promise<void> {
		localStorage.setItem('FS_tree', JSON.stringify(get_tree_from_container()));
	},
	get_tree_from_container,
	async add_file(path: string) {
		await webcontainer_instance.fs.writeFile(path, '');
		//if we are not already listening we can add the file in store ourself
		if (!get(listening_for_fs_store)) {
			add_file_in_store(files_store, path, '', true);
		}
	},
	async add_folder(path: string) {
		await webcontainer_instance.fs.mkdir(path, {
			recursive: true
		});
		get_subtree_from_path(path, get(files_store), true);
		//trigger rerender
		files_store.update((value) => value);
	},
	async delete_file(path: string) {
		await webcontainer_instance.fs.rm(path, {
			recursive: true
		});
		try {
			delete_file_from_store(files_store, path);
		} catch (e) {
			/* empty */
		}
	},
	async read_file(path: string) {
		try {
			return webcontainer_instance.fs.readFile(path, 'utf8');
		} catch (e) {
			return '';
		}
	},
	async read_package_json() {
		try {
			const file = await this.read_file('./package.json');
			return JSON.parse(file);
		} catch (e) {
			return '';
		}
	},
	async get_share_url() {
		const container_tree = await get_tree_from_container();
		// we delete package-lock because it's not needed
		// and it bloat the url
		delete container_tree['package-lock.json'];
		const url = new URL(window.location.href);
		url.pathname = '';
		const encoded = compressToEncodedURIComponent(JSON.stringify(container_tree));
		const url_search_params = new URLSearchParams();
		url_search_params.set('code', encoded);
		url.hash = url_search_params.toString();
		return url;
	},

	set_iframe_path(iframe_path: string) {
		merge_state({ iframe_path });
	}
};

async function get_tree_from_container(): Promise<FileSystemTree> {
	const root = await webcontainer_instance.fs.readdir('/', { withFileTypes: true });
	return get_tree(root, '/');
}

const decoder = new TextDecoder();
async function get_tree(dir: DirEnt<string>[], path: string): Promise<FileSystemTree> {
	const tree: FileSystemTree = {};
	for (const node of dir) {
		const node_path = path + node.name;
		if (node.isFile()) {
			const raw_data = await webcontainer_instance.fs.readFile(node_path);
			const contents = decoder.decode(raw_data); // convert to POJO
			tree[node.name] = {
				file: {
					contents
				}
			};
		} else if (node.isDirectory() && !IGNORE_LIST.includes(node.name)) {
			tree[node.name] = {
				directory: await get_tree(
					await webcontainer_instance.fs.readdir(node_path, { withFileTypes: true }),
					node_path + '/'
				)
			};
		}
	}
	return tree;
}

const IGNORE_LIST = ['.svelte-kit', 'node_modules'];
