import { terminal } from '$lib/terminal';
import { get_cookies } from '$lib/utils/various';
import { onMount } from 'svelte';
import { writable } from 'svelte/store';

type Theme = 'light' | 'dark' | null;

const { subscribe, set: _set } = writable<Theme>(null);

/**
 * Those are the values of the css variables, we need to store them as plain rgb becuase
 * xtermjs validates that the string is an rgb.
 */
const variables_mapping = new Map<Theme, { sk_code_bg: string; sk_code_fg: string }>([
	[
		'light',
		{
			sk_code_bg: '#f7fafd',
			sk_code_fg: '#5f5c53'
		}
	],
	[
		'dark',
		{
			sk_code_bg: '#1a1a1a',
			sk_code_fg: '#c4c1bb'
		}
	]
]);

let mounted_by = 0;

function set(new_value: Theme) {
	_set(new_value);
	// if we are setting to a new value we use the new value if we are setting
	// to null we use the value from match media
	let to_set = new_value;
	if (!new_value) {
		const media = window.matchMedia('(prefers-color-scheme: dark)');
		to_set = media.matches ? 'dark' : 'light';
	}

	// whenever the theme changes we update the theme of the terminal

	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const { sk_code_bg, sk_code_fg } = variables_mapping.get(to_set)!;
	terminal.options.theme = {
		...terminal.options.theme,
		background: sk_code_bg,
		foreground: sk_code_fg
	};
}

function set_theme_and_cookie(value: Theme) {
	set(value);
	if (value) {
		document.documentElement.className = value;
		document.cookie = `svelteblitz-theme=${value}`;
	} else {
		document.documentElement.className = '';
		document.cookie = `svelteblitz-theme=; Max-Age=-9999999999`;
	}
}

export function get_theme() {
	onMount(() => {
		const media = window.matchMedia('(prefers-color-scheme: dark)');
		const cookies = get_cookies();
		const listener = (event: MediaQueryListEvent) => {
			if (!cookies['svelteblitz-theme']) {
				set(event.matches ? 'dark' : 'light');
			}
		};
		mounted_by++;
		// if we use this store in different components there's no need to
		// set it every time so we keep track of how many components mount
		// it and only run the set and add the listener the first time
		if (mounted_by === 1) {
			if (!cookies['svelteblitz-theme']) {
				set(media.matches ? 'dark' : 'light');
			} else {
				set(cookies['svelteblitz-theme']);
			}
			media.addEventListener('change', listener);
		}
		return () => {
			media.removeEventListener('change', listener);
			mounted_by--;
		};
	});
	return {
		subscribe,
		next() {
			const cookies = get_cookies();
			if (!cookies['svelteblitz-theme']) {
				const media = window.matchMedia('(prefers-color-scheme: dark)');
				if (media.matches) {
					set_theme_and_cookie('light');
				} else {
					set_theme_and_cookie('dark');
				}
			} else {
				if (cookies['svelteblitz-theme'] === 'light') {
					set_theme_and_cookie('dark');
				} else {
					set_theme_and_cookie(null);
				}
			}
		}
	};
}
