import { writable } from 'svelte/store';

const { subscribe, set } = writable(false);

export const command_runner = {
	subscribe,
	open() {
		set(true);
	},
	close() {
		set(false);
	}
};
