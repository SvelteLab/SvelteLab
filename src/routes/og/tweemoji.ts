/**
 * Modified version of https://github.com/vercel/satori/blob/main/playground/utils/twemoji.ts
 */

/**
 * Modified version of https://unpkg.com/twemoji@13.1.0/dist/twemoji.esm.js.
 */

/*! Copyright Twitter Inc. and other contributors. Licensed under MIT */

const U200D = String.fromCharCode(8205);
const UFE0Fg = /\uFE0F/g;

export function get_icon_code(char: string) {
	return to_code_point(char.indexOf(U200D) < 0 ? char.replace(UFE0Fg, '') : char);
}

function to_code_point(unicodeSurrogates: string) {
	const r = [];
	let c = 0,
		p = 0,
		i = 0;

	while (i < unicodeSurrogates.length) {
		c = unicodeSurrogates.charCodeAt(i++);
		if (p) {
			r.push((65536 + ((p - 55296) << 10) + (c - 56320)).toString(16));
			p = 0;
		} else if (55296 <= c && c <= 56319) {
			p = c;
		} else {
			r.push(c.toString(16));
		}
	}
	return r.join('-');
}

const emoji_cache: Record<string, Promise<string>> = {};

export function load_emoji(code: string) {
	const key = code;
	if (key in emoji_cache) return emoji_cache[key];
	return (emoji_cache[key] = fetch(
		`https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/${code.toLowerCase()}.svg`
	).then((r) => r.text()));
}
