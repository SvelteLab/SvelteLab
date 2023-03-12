import { browser } from '$app/environment';
import { PUBLIC_THEME_COOKIE_NAME } from '$env/static/public';
import { get, writable } from 'svelte/store';
import { get_cookie } from './cookie';
import { update_terminal_theme } from './update_terminal_theme';

export type Theme = 'light' | 'dark';

/**
 * We need this wrapper function to get the update_terminal variable. If we don't
 * do getting the store from a page without the terminal would either fail or
 * require a non-useful instantiation of a new the terminal.
 * @param {boolean} update_terminal Wheter the terminal is present on the page
 * and needs to be updated or not.
 * @returns A promise with the store.
 */
export function get_theme(update_terminal = true) {
	const store = writable<{ current: Theme; next: Theme }>(initial_state());

	function initial_state() {
		const user_preference = get_cookie(PUBLIC_THEME_COOKIE_NAME) as Theme | undefined;
		if (!user_preference && browser) {
			window
				.matchMedia('(prefers-color-scheme: dark)')
				.addEventListener('change', handle_os_preference_change);
		}
		const current = user_preference || get_preference_from_os();
		if (browser) {
			document.documentElement.className = user_preference || '';
		}
		update_terminal_theme(current, update_terminal);
		return { current, next: get_opposite(current) };
	}

	async function change_preference() {
		if (browser) {
			window
				.matchMedia('(prefers-color-scheme: dark)')
				.removeEventListener('change', handle_os_preference_change);
		}
		const { next: current } = get(store);
		const next = get_opposite(current);
		store.set({ current, next });
		if (browser) {
			document.documentElement.className = current;
		}
		update_terminal_theme(current, update_terminal);
		await set_theme_cookie(current);
	}

	function handle_os_preference_change() {
		if (get_cookie(PUBLIC_THEME_COOKIE_NAME)) return;
		const current = get_preference_from_os();
		update_terminal_theme(current, update_terminal);
		store.set({ current, next: get_opposite(current) });
	}

	async function remove_preference() {
		await set_theme_cookie();
		store.set(initial_state());
	}

	function get_opposite(current: Theme): Theme {
		if (current === 'dark') {
			return 'light';
		} else {
			return 'dark';
		}
	}

	function get_preference_from_os(): Theme {
		const os_prefers_dark = browser && window.matchMedia('(prefers-color-scheme: dark)').matches;
		if (os_prefers_dark) return 'dark';
		return 'light';
	}

	function set_theme_cookie(theme?: Theme) {
		return fetch('/theme', {
			method: 'POST',
			body: JSON.stringify({ theme })
		});
	}

	return {
		subscribe: store.subscribe,
		change_preference,
		remove_preference
	};
}
