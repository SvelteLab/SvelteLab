import { browser } from "$app/environment";
import { get_cookies } from "$lib/utils/various";
import { get, writable } from "svelte/store";

type Theme = "light" | "dark" | null;

const { subscribe, set, update } = writable<Theme>();

if (browser) {
	const media = window.matchMedia("(prefers-color-scheme: dark)");
	const cookies = get_cookies();
	if (!cookies["svelteblitz-theme"]) {
		set(media.matches ? "dark" : "light");
	}
	media.addEventListener("change", (event) => {
		if (!cookies["svelteblitz-theme"]) {
			set(event.matches ? "dark" : "light");
		}
	});
}

function set_theme_and_cookie(value: Theme) {
	set(value);
	console.log({ value });
	if (value) {
		document.documentElement.className = value;
		document.cookie = `svelteblitz-theme=${value}`;
	} else {
		document.documentElement.className = '';
		document.cookie = `svelteblitz-theme=; Max-Age=-9999999999`;
	}
}

export const theme = {
	subscribe,
	next() {
		const cookies = get_cookies();
		console.log(cookies);
		if (!cookies["svelteblitz-theme"]) {
			const media = window.matchMedia("(prefers-color-scheme: dark)");
			if (media.matches) {
				set_theme_and_cookie("light");
			} else {
				set_theme_and_cookie("dark");
			}
		} else {
			if (cookies["svelteblitz-theme"] === "light") {
				set_theme_and_cookie("dark");
			} else {
				set_theme_and_cookie(null);
			}
		}
	}
}

