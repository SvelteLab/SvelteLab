import { get, writable } from 'svelte/store';

const { subscribe: subscribe_tabs, update: update_tabs } = writable(
	new Set<string>().add('/src/routes/+page.svelte')
);
export const tabs = { subscribe: subscribe_tabs };

const { subscribe: subscribe_current_tab, set: set_current_tab } = writable(
	'/src/routes/+page.svelte'
);
export const current_tab = { subscribe: subscribe_current_tab };

export function open_file(path: string) {
	set_current_tab(path);
	update_tabs(($tabs) => $tabs.add(path));
}

export function close_file(path: string) {
	update_tabs(($tabs) => {
		const $current_tab = get(current_tab);
		const tabs_array = [...$tabs];
		if (path === $current_tab) {
			const tab_index_to_open = tabs_array.findIndex((p) => p === $current_tab) - 1;
			let next_tab = tabs_array.at(tab_index_to_open) || '';
			next_tab = next_tab !== $current_tab ? next_tab : '';
			set_current_tab(next_tab);
		}
		$tabs.delete(path);
		return $tabs;
	});
}

export function close_all_tabs() {
	update_tabs(($tabs) => {
		$tabs.clear();
		return $tabs;
	});
	set_current_tab('');
}
