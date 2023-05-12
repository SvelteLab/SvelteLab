import { persisted } from 'svelte-local-storage-store';

interface EditorConfigStore {
	vim: boolean;
	code_wrap: boolean;
}

const { subscribe, update } = persisted<EditorConfigStore>('editor_config', {
	vim: false,
	code_wrap: false,
});

function toggle_state(key: keyof EditorConfigStore) {
	update((state) => ({
		...state,
		[key]: !state[key],
	}));
}

const toggle_vim = () => toggle_state('vim');
const toggle_code_wrap = () => toggle_state('code_wrap');

export const editor_config = {
	subscribe,
	toggle_vim,
	toggle_code_wrap,
};
