import { persisted } from 'svelte-local-storage-store';

export const editor_config = persisted('editor_config', {
	vim: false
});
