import { persisted } from 'svelte-local-storage-store';

const default_preferences = {
	delay_function: 'throttle' as 'throttle' | 'debounce',
	delay_duration: 300,
};

const editor_preferences = persisted('sk__editor_preferences', default_preferences);

export default editor_preferences;

export function set_default_editor_preferences() {
	editor_preferences.set({ ...default_preferences });
}
