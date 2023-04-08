import { persisted } from 'svelte-local-storage-store';

interface LayoutStore {
	file_tree: number;
	terminal: number;
	show_config: boolean;
	folders_first: boolean;
}

const { subscribe, update, set } = persisted<LayoutStore>('layout_preferences', {
	file_tree: 30,
	terminal: 30,
	show_config: true,
	folders_first: true
});

function toggle_state(key: keyof LayoutStore) {
	update((state) => ({
		...state,
		[key]: !state[key]
	}));
}

type LayoutKeysByType<T> = keyof {
	[Key in keyof LayoutStore as LayoutStore[Key] extends T ? Key : never]: LayoutStore[Key];
};

function toggle_number(key: LayoutKeysByType<number>) {
	update((state) => ({
		...state,
		[key]: state[key] === 0 ? 30 : 0
	}));
}

const toggle_file_tree = () => toggle_number('file_tree');
const toggle_terminal = () => toggle_number('terminal');
const toggle_config = () => toggle_state('show_config');
const toggle_sort = () => toggle_state('folders_first');

export const layout_store = {
	subscribe,
	set,
	toggle_file_tree,
	toggle_terminal,
	toggle_config,
	toggle_sort
};
