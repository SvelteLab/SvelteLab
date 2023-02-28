import { browser } from "$app/environment";

export function get_cookies() {
	if (!browser) return {};
	return Object.fromEntries(document.cookie.split('; ').map((cookie) => cookie.split('=')));
}