import { browser, dev } from '$app/environment';
import { terminal } from '$lib/terminal';
import { get_file_from_path, get_subtree_from_path } from '$lib/utils/file_system';
import {
	WebContainer,
	type DirEnt,
	type FileSystemTree,
	type WebContainerProcess
} from '@webcontainer/api';
import { get, writable, type Writable } from 'svelte/store';
import { files as default_files } from './files';

const initial_files = get_tree_from_local_storage() || default_files;

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

const { subscribe, update } = writable({
	current_file: null as string | null,
	current_path: null as string | null,
	iframe_url: './loading',
	running_command: null as string | null,
	running_process: null as WebContainerProcess | null
});

type WebcontainerStoreType = Parameters<typeof subscribe>['0'] extends (
	value: infer ActualType
) => unknown
	? ActualType
	: never;

function merge_state(state: Partial<WebcontainerStoreType>) {
	update((previous_state) => ({ ...previous_state, ...state }));
}

/**
 * An utility function to run a command on the webcontainer instance as a string
 * it will automatically split the command by it's args and pipe every log to the
 * logs array.
 * @param cmd a string representing a command you want to run
 * @returns the exit code of the command
 */
async function run_command(cmd: string) {
	const [command, ...args] = cmd.split(' ');
	const process = await webcontainer_instance.spawn(command, args);
	merge_state({
		running_command: cmd,
		running_process: process
	});
	process.output.pipeTo(
		new WritableStream({
			write(data) {
				terminal.write(data);
			}
		})
	);
	return process.exit.then((code: number) => {
		merge_state({
			running_command: null,
			running_process: null
		});
		return code;
	});
}

/**
 * Readable store for the file system tree, we duplicate this so that
 * the file system tree does not have to re-evaluate every keystroke
 */
const files_store = writable(structuredClone(initial_files));

export const files = {
	subscribe: files_store.subscribe
};

/**
 * Writable store for the file system, we can save this to our storage
 */
const in_memory_fs_store = writable(structuredClone(initial_files));

export const in_memory_fs = { subscribe: in_memory_fs_store.subscribe };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function add_file_in_store(
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

/**
 * Ther actual webcontainer store with useful methods
 */
export const webcontainer = {
	subscribe,
	/**
	 * init the webcontainer and mount the files
	 */
	async init(toMount?: FileSystemTree) {
		if (webcontainer_instance instanceof WebContainer) {
			if (dev) {
				console.warn(
					"You are trying to init the webcontainer multiple times and that's not permitted. Check your code!"
				);
			}
			return;
		}
		if (toMount) {
			in_memory_fs_store.set(structuredClone(toMount));
			files_store.set(structuredClone(toMount));
		}
		webcontainer_instance = await WebContainer.boot();
		webcontainer_instance.mount(toMount ?? initial_files);
	},
	/**
	 * Read the file from the file system of the webcontainer and set the content to the
	 * current_file (also changing the current_path). If the file does not exist it throws.
	 * @param path the path to the file to open.
	 */
	async open_file(path: string) {
		const current_file = await webcontainer_instance.fs.readFile(path, 'utf8');
		merge_state({ current_file, current_path: path });
	},
	/**
	 * Write a file inside the file system of the webcontainer.
	 * If the file does not exist it throws.
	 * @param path the path to a file in the virtual file system to update
	 * @param content The content of the file to be written
	 */
	update_file(path: string, content: string) {
		webcontainer_instance.fs.writeFile(path, content);
		add_file_in_store(in_memory_fs_store, path, content);
	},

	/**
	 * Run the initial npm install
	 * @returns a promise that fulfill when the command has finished to run
	 */
	async install_dependencies() {
		return run_command('npm install');
	},
	/**
	 * Run the dev server and register a callback on "server-ready"
	 * to update the iframe url;
	 */
	async run_dev_server() {
		run_command('npm run dev');
		webcontainer_instance.on('server-ready', (port, url) => {
			merge_state({ iframe_url: url });
			webcontainer_instance.on('port', (closed_port: number) => {
				if (port === closed_port) {
					merge_state({ iframe_url: './error' });
				}
			});
		});
	},
	run_command,
	/**
	 * Saves the container file system to local storage
	 */
	async save(): Promise<void> {
		localStorage.setItem('FS_tree', JSON.stringify(get(in_memory_fs_store)));
	},
	async add_file(path: string) {
		await webcontainer_instance.fs.writeFile(path, '');
		add_file_in_store(in_memory_fs_store, path, '', true);
		add_file_in_store(files_store, path, '', true);
	},
	async add_folder(path: string) {
		await webcontainer_instance.fs.mkdir(path, {
			recursive: true
		});
		get_subtree_from_path(path, get(files_store), true);
		get_subtree_from_path(path, get(in_memory_fs_store), true);
		//trigger rerender
		in_memory_fs_store.update((value) => value);
		files_store.update((value) => value);
	},
	async delete_file(path: string) {
		await webcontainer_instance.fs.rm(path, {
			recursive: true
		});
		if (get(webcontainer).current_path?.includes(path)) {
			merge_state({
				current_file: null,
				current_path: null
			});
		}
		delete_file_from_store(in_memory_fs_store, path);
		delete_file_from_store(files_store, path);
	}
};

function get_tree_from_local_storage() {
	if (!browser) return;
	const string = localStorage.getItem('FS_tree');
	if (!string) return;
	return JSON.parse(string);
}

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
