export const repl_id = writable<string | undefined>();
export const repl_name = writable<string>('Hello World');
export const is_repl_saving = writable(false);
export const is_repl_to_save = writable(false);
import { writable, derived } from 'svelte/store';

function create_file_status_store() {
	const file_status = writable<Record<string, boolean>>({});

	const set_file_edited_status = (path: string, status: boolean) => {
		file_status.update((file_status) => ({
			...file_status,
			[path]: status,
		}));
	};

	const reset_all_file_status = () => {
		file_status.set({});
	};

	const is_file_edited = (path: string) => {
		return derived(file_status, ($file_status) => {
			return $file_status[path] || false;
		});
	};

	return {
		subscribe: file_status.subscribe,
		set: file_status.set,
		update: file_status.update,
		set_file_edited_status,
		reset_all_file_status,
		is_file_edited,
	};
}

export const file_status = create_file_status_store();
