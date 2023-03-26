import { get, writable } from 'svelte/store';

const store = writable(new Set<string>(['./src', './src/routes']));

export const expanded_paths = { subscribe: store.subscribe };

export const expand_path = (path: string) => {
	store.update(($expanded) => $expanded.add(path));
};

export const shrink_path = (path: string) => {
	store.update(($expanded) => {
		$expanded.delete(path);
		return $expanded;
	});
};

export const toggle_path = (path: string) => {
	const $expanded = get(store);
	if ($expanded.has(path)) {
		shrink_path(path);
	} else {
		expand_path(path);
	}
};
