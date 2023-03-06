import { browser } from '$app/environment';

export const THEME_COOKIE = 'svelteblitz-theme';

export function get_cookies() {
	if (!browser) return {};
	return Object.fromEntries(
		document.cookie.split('; ').map((cookie) => cookie.split('='))
	) as Record<string, string>;
}

export function get_cookie(name: string): string | undefined {
	return get_cookies()[name];
}

export function set_cookie(name: string, value: string) {
	const cookies = get_cookies();
	cookies[name] = value;
	document.cookie = Object.entries(cookies)
		.map((key_value) => key_value.join('='))
		.join(';');
}
