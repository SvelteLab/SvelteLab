import { persisted } from 'svelte-local-storage-store';

export const { subscribe, update } = persisted('sveltelab-closed-categories', [] as string[]);

function toggle(category: string) {
	update((categories) => {
		if (categories.includes(category)) {
			categories = categories.filter((cat) => cat !== category);
		} else {
			categories.push(category);
		}
		return categories;
	});
}

export const closed_categories_store = {
	subscribe,
	toggle
};
