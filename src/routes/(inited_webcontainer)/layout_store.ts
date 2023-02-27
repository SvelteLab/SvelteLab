import { writable } from 'svelte/store';

interface LayoutStore {
	file_tree: boolean;
	terminal: boolean;
}

const { subscribe, update } = writable<LayoutStore>({
	file_tree: false,
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
