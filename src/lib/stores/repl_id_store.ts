export const repl_id = writable<string | undefined>();
export const repl_name = writable<string>('Hello world');
export const is_repl_saving = writable(false);
export const is_repl_to_save = writable(false);
import { writable, derived } from 'svelte/store';

function createFileStatusStore() {
	const file_status = writable<Record<string, boolean>>({});

	const setFileEditedStatus = (path: string, status: boolean) => {
		file_status.update((fileStatus) => ({
			...fileStatus,
			[path]: status,
		}));
	};

	const resetAllFileStatus = () => {
		file_status.set({});
	};

	const isFileEdited = (path: string) => {
		return derived(file_status, ($fileStatus) => {
			return $fileStatus[path] || false;
		});
	};

	return {
		subscribe: file_status.subscribe,
		set: file_status.set,
		update: file_status.update,
		setFileEditedStatus,
		resetAllFileStatus,
		isFileEdited,
	};
}

export const file_status = createFileStatusStore();
