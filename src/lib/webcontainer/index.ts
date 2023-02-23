import { WebContainer } from '@webcontainer/api';
import { writable } from "svelte/store";
import { files } from './files';
console.log("starting");
const webcontainer_instance = await WebContainer.boot();
webcontainer_instance.mount(files);

const { subscribe, update } = writable({
	current_file: files.src.directory.routes.directory['+page.svelte'].file.contents,
	current_path: './src/routes/+page.svelte',
	iframe_url: './loading',
});
const { subscribe: subscribe_logs, update: update_logs } = writable<string[]>([]);

type StoreType = Parameters<typeof subscribe>["0"] extends (value: infer ActualType) => unknown ? ActualType : never;

function merge_state(state: Partial<StoreType>) {
	update(previous_state => ({ ...previous_state, state }));
}

export const logs = { subscribe: subscribe_logs };

export const webcontainer = {
	subscribe,
	async open_file(path: string) {
		const current_file = await webcontainer_instance.fs.readFile(path, "utf8");
		merge_state({ current_file, current_path: path });
	},
	update_file(path: string, content: string) {
		webcontainer_instance.fs.writeFile(path, content);
	},
	async install_dependencies() {
		const process = await webcontainer_instance.spawn("npm", ["install"]);
		process.output.pipeTo(new WritableStream({
			write(data) {
				update_logs(prev => [...prev, data]);
			}
		}));
		return process.exit;
	},
	async run_dev_server() {
		webcontainer_instance.spawn("npm", ["run", "dev"]);
		webcontainer_instance.on("server-ready", (port, url) => {
			merge_state({ iframe_url: url });
		});
	}
};

