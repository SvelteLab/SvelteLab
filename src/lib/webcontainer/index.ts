import { get_file_from_path } from '$lib/utils/file_system';
import { WebContainer, type DirEnt, type FileSystemTree } from '@webcontainer/api';
import { get, readable, writable } from 'svelte/store';
import { files as default_files } from './files';

const initial_files = get_tree_from_local_storage() || default_files;

/**
 * Used to throw an useful error if you try to access any function befor initing
 * the web container.
 */
const recursive_warning_proxy_traps: ProxyHandler<never> = {
	get(_, prop) {
		if (prop === 'unbooted') return true;
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
	current_file: initial_files.src.directory.routes.directory['+page.svelte'].file.contents,
	current_path: './src/routes/+page.svelte',
	iframe_url: './loading'
});
const { subscribe: subscribe_logs, update: update_logs } = writable<string[]>([]);

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
	process.output.pipeTo(
		new WritableStream({
			write(data) {
				update_logs((prev) => [...prev, data]);
			}
		})
	);
	return process.exit;
}

/**
 * This is the list of logs from the webcontainer.
 * N.b. they are strings with ANSI colors (that's why they are parsed with ansi-to-html)
 */
export const logs = { subscribe: subscribe_logs };

/**
 * Readable store for the file system tree, we duplicate this so that
 * the file system tree does not have to re-evaluate every keystroke
 */
export const files = readable(initial_files);

/**
 * Writable store for the file system, we can save this to our storage
 */
export const in_memory_fs = writable(initial_files);

/**
 * Ther actual webcontainer store with useful methods
 */
export const webcontainer = {
	subscribe,
	/**
	 * init the webcontainer and mount the files
	 */
	async init() {
		if (webcontainer_instance instanceof WebContainer) {
			console.warn(
				"You are trying to init the webcontainer multiple times and that's not permitted. Check your code!"
			);
			return;
		}
		webcontainer_instance = await WebContainer.boot();
		webcontainer_instance.mount(initial_files);
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
		//get the file content from the path
		const subtree = get_file_from_path(path, get(in_memory_fs));
		//update the in memory store
		subtree.contents = content;
		in_memory_fs.set(get(in_memory_fs));
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
		});
	},
	run_command,

	/**
	 * Saves the container file system to local storage
	 */
	async save(): Promise<void> {
		const tree = await get_tree_from_container();
		localStorage.setItem('FS_tree', JSON.stringify(tree));
	}
};

function get_tree_from_local_storage() {
	const string = localStorage.getItem('FS_tree');
	if (!string) return;
	return JSON.parse(string);
}

async function get_tree_from_container(): Promise<FileSystemTree> {
	const root = await webcontainer_instance.fs.readdir('/', { withFileTypes: true });
	return get_tree(root, '/');
}

async function get_tree(dir: DirEnt<string>[], path: string): Promise<FileSystemTree> {
	const decoder = new TextDecoder();
	const tree: FileSystemTree = {};
	for (const node of dir) {
		const node_path = path + node.name;
		// console.log('READING: ' + node_path + (node.isDirectory() ? '/' : ''));
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
