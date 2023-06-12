import { persisted } from 'svelte-local-storage-store';

interface EditorConfigStore {
	vim: boolean;
	code_wrap: boolean;
}

const default_preferences = {
	delay_function: 'throttle' as 'throttle' | 'debounce',
	delay_duration: 300,
};

export const editor_preferences = persisted('sk__editor_preferences', default_preferences);

export function set_default_editor_preferences() {
	editor_preferences.set({ ...default_preferences });
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
