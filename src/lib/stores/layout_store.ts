import { persisted } from 'svelte-local-storage-store';

interface LayoutStore {
	file_tree: boolean;
	terminal: boolean;
}

const { subscribe, update } = persisted<LayoutStore>('layout_preferences', {
	file_tree: true,
	terminal: false
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

export const layout_store = { subscribe, toggle_file_tree, toggle_terminal };
