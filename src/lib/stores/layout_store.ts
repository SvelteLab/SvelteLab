import { persisted } from 'svelte-local-storage-store';

interface LayoutStore {
	file_tree: boolean;
	terminal: boolean;
	show_config: boolean;
	folders_first: boolean;
}

const { subscribe, update } = persisted<LayoutStore>('layout_preferences', {
	file_tree: true,
	terminal: false,
	show_config: false,
	folders_first: false
});

async function toggle_state(key: keyof LayoutStore) {
	update((state) => ({
		...state,
		[key]: !state[key]
	}));
}

const toggle_file_tree = () => toggle_state('file_tree');
const toggle_terminal = () => toggle_state('terminal');
const toggle_config = () => toggle_state('show_config');
const toggle_sort = () => toggle_state('folders_first');

export const layout_store = {
	subscribe,
	toggle_file_tree,
	toggle_terminal,
	toggle_config,
	toggle_sort
};
