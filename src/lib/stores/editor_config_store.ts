import { persisted } from 'svelte-local-storage-store';

interface EditorConfigStore {
	vim: boolean;
}

const { subscribe, update } = persisted<EditorConfigStore>('editor_config', {
	vim: false,
});

function toggle_state(key: keyof EditorConfigStore) {
	update((state) => ({
		...state,
		[key]: !state[key],
	}));
}

const toggle_vim = () => toggle_state('vim');

export const editor_config = {
	subscribe,
	toggle_vim,
};
