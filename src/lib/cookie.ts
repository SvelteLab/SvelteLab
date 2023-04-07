import { browser } from '$app/environment';

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
	document.cookie = `${name}=${value}`;
}
