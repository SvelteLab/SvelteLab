import { WebContainer } from '@webcontainer/api';
import { writable } from "svelte/store";
import { files } from './files';

const webcontainer_instance = await WebContainer.boot();
webcontainer_instance.mount(files);
const { subscribe, update } = writable({
	current_file: files.src.directory.routes.directory['+page.svelte'].file.contents,
	current_path: './src/routes/+page.svelte',
});

export const webcontainer = {
	subscribe,
	async open_file(path: string) {
		const current_file = await webcontainer_instance.fs.readFile(path, "utf8");
		update(prev_webcontainer => ({ ...prev_webcontainer, current_file, current_path: path }));
	},
	update_file(path: string, content: string) {
		webcontainer_instance.fs.writeFile(path, content);
	}
};

