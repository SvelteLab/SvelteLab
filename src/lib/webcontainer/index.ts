import { WebContainer } from '@webcontainer/api';
import { writable } from "svelte/store";
import { files } from './files';

const webcontainer_instance = await WebContainer.boot();
webcontainer_instance.mount(files);
const { subscribe, update } = writable({
	current_file: files.src.directory.routes.directory['+page.svelte'].file.contents,
	current_path: './src/routes/+page.svelte',
	logs: [] as string[],
});

type StoreType = Parameters<typeof subscribe>["0"] extends (value: infer ActualType) => unknown ? ActualType : never;

function merge_state(state: Partial<StoreType>) {
	update(previous_state => {
		const new_state = structuredClone(previous_state);
		Object.keys(new_state).forEach((_key) => {
			const key = _key as keyof typeof new_state;
			if (Array.isArray(new_state[key])) {
				//todo deepmerge
			}
		});
		return new_state;
	});
}

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
				merge_state({
					logs: []
				});
			}
		}));
	}
};

