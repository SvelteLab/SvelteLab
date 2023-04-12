import { writable } from 'svelte/store';

const { subscribe, set } = writable<'code' | 'iframe' | 'terminal'>('code');
export const showing_files = writable(false);

export const mobile_showing = {
	subscribe,
	show_code() {
		set('code');
	},
	show_iframe() {
		set('iframe');
	},
	show_terminal() {
		set('terminal');
	},
};
