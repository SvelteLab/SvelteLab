import { persisted } from 'svelte-local-storage-store';
import type { Writable } from 'svelte/store';

const layout_preferences = persisted('layout_preferences', {
	file_tree: 30,
	terminal: 30,
	apps: 0,
	show_config: true,
	folders_first: true,
});

const { subscribe, update, set } = layout_preferences;

type LayoutStore = typeof layout_preferences extends Writable<infer WritableType>
	? WritableType
	: never;

function toggle_state(key: keyof LayoutStore) {
	update((state) => ({
		...state,
		[key]: !state[key],
	}));
}

type LayoutKeysByType<T> = keyof {
	[Key in keyof LayoutStore as LayoutStore[Key] extends T ? Key : never]: LayoutStore[Key];
};

function toggle_number(key: LayoutKeysByType<number>, base_number: number) {
	update((state) => ({
		...state,
		[key]: state[key] === 0 ? base_number : 0
	}));
}

const toggle_apps = () => toggle_number('apps', 15);
const toggle_file_tree = () => toggle_number('file_tree', 30);
const toggle_terminal = () => toggle_number('terminal', 30);
const toggle_config = () => toggle_state('show_config');
const toggle_sort = () => toggle_state('folders_first');

export const layout_store = {
	subscribe,
	set,
	toggle_apps,
	toggle_file_tree,
	toggle_terminal,
	toggle_config,
	toggle_sort,
};
