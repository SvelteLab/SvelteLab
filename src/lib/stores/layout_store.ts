import { persisted } from 'svelte-local-storage-store';

interface LayoutStore {
	file_tree: boolean;
	terminal: boolean;
	show_config: boolean;
}

const { subscribe, update } = persisted<LayoutStore>('layout_preferences', {
	file_tree: true,
	terminal: false,
	show_config: false
});

function toggle_file_tree() {
	update((state) => ({
		...state,
		file_tree: !state.file_tree
	}));
}

function toggle_terminal() {
	update((state) => ({
		...state,
		terminal: !state.terminal
	}));
}

function toggle_config() {
	update((state) => ({
		...state,
		show_config: !state.show_config
	}));
}

export const layout_store = { subscribe, toggle_file_tree, toggle_terminal, toggle_config };
