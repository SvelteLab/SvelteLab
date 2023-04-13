import { writable } from 'svelte/store';

const { subscribe, set } = writable({
	open: false,
	command: '',
});

export const command_runner = {
	subscribe,
	open(command = '') {
		set({
			open: true,
			command,
		});
	},
	close() {
		set({
			open: false,
			command: '',
		});
	},
};
