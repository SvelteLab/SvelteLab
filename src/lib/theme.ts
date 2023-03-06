import { get, writable } from 'svelte/store';
import { get_cookie, set_cookie, THEME_COOKIE } from './cookie';
import { update_terminal_theme } from './terminal';

export type Theme = 'light' | 'dark';

const store = writable<{ current: Theme; next: Theme }>(init());

function init() {
	const user_preference = get_cookie(THEME_COOKIE) as Theme | undefined;
	if (!user_preference) {
		window
			.matchMedia('(prefers-color-scheme: dark)')
			.addEventListener('change', handle_os_preference_change);
	}
	const current = user_preference || get_preference_from_os();
	document.documentElement.className = user_preference || '';
	update_terminal_theme(current);
	return { current, next: get_opposite(current) };
}

function change_preference() {
	window
		.matchMedia('(prefers-color-scheme: dark)')
		.addEventListener('change', handle_os_preference_change);
	const { next: current } = get(store);
	const next = get_opposite(current);
	store.set({ current, next });
	document.documentElement.className = current;
	update_terminal_theme(current);
	set_cookie(THEME_COOKIE, current);
}

function handle_os_preference_change() {
	if (get_cookie(THEME_COOKIE)) return;
	const current = get_preference_from_os();
	update_terminal_theme(current);
	store.set({ current, next: get_opposite(current) });
}

function remove_preference() {
	set_cookie(THEME_COOKIE, '');
	store.set(init());
}

function get_opposite(current: Theme): Theme {
	if (current === 'dark') {
		return 'light';
	} else {
		return 'dark';
	}
}

function get_preference_from_os(): Theme {
	const os_prefers_dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
	if (os_prefers_dark) return 'dark';
	return 'light';
}

export const theme = {
	subscribe: store.subscribe,
	change_preference,
	remove_preference
};
