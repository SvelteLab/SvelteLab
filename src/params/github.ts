import type { ParamMatcher } from '@sveltejs/kit';
/**
 * super simple param matcher to match both github and github.com
 * to allow the user to easily prepone sveltelab.dev in a repo
 * to open it in sveltelab or share it with a nicer url
 */
export const match: ParamMatcher = (param) => {
	return /^github(?:\.com)?$/.test(param);
};
