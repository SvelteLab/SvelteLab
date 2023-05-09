import { get, writable } from 'svelte/store';
import { expand_path_to_file } from './stores/expanded_paths';
import { mobile_showing, showing_files } from './stores/mobile_showing_store';

const { subscribe: subscribe_tabs, update: update_tabs, set: set_tabs } = writable<string[]>([]);
export const tabs = { subscribe: subscribe_tabs };

const { subscribe: subscribe_current_tab, set: set_current_tab } = writable('');
export const current_tab = { subscribe: subscribe_current_tab };

export function open_file(path: string) {
	set_current_tab(path);

	update_tabs(($tabs) => {
		if (!$tabs.includes(path)) {
			$tabs.push(path);
		}
		return $tabs;
	});

	expand_path_to_file(path);
	mobile_showing.show_code();
	showing_files.set(false);
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
		const index = $tabs.findIndex((p) => p === path);
		$tabs.splice(index, 1);
		return $tabs;
	});
}

export function close_all_subpath(path: string) {
	update_tabs(($tabs) => {
		[...$tabs].forEach((tab) => {
			if (tab.startsWith(path)) {
				const index = $tabs.findIndex((p) => p === path);
				$tabs.splice(index, 1);
			}
		});
		return $tabs;
	});
}

export function rename_tab(old_path: string, new_path: string) {
	update_tabs(($tabs) => {
		const index = $tabs.findIndex((p) => p === old_path);
		if (index >= 0) {
			$tabs.splice(index, 1);
			$tabs.push(new_path);
		}
		return $tabs;
	});
}

export function close_all_tabs() {
	set_tabs([]);
	set_current_tab('');
}

export function reorder_tabs(old_index: number, new_index: number) {
	update_tabs(($tabs) => {
		const [item] = $tabs.splice(old_index, 1);
		$tabs.splice(new_index, 0, item);
		return $tabs;
	});
}
