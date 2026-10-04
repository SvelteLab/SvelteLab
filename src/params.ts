import { defineParams } from '@sveltejs/kit/params';

/**
 * super simple param matcher to match both github and github.com
 * to allow the user to easily prepone sveltelab.dev in a repo
 * to open it in sveltelab or share it with a nicer url
 */
const matchGithub = (param) => {
	return /^github(?:\.com)?$/.test(param);
};

export const params = defineParams({
	github: (param) => (matchGithub(param) ? param : undefined),
});
