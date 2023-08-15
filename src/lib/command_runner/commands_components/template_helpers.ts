import Lib from '~icons/material-symbols/local-library-rounded';
import Tailwind from '~icons/mdi/tailwind';
import Mdsvex from '~icons/simple-icons/markdown';
import Basic from '~icons/simple-icons/svelte';
import Typescript from '~icons/simple-icons/typescript';
import OpenProps from '~icons/sveltelab/open-props';
import Melt from '~icons/sveltelab/melt';
import Threlte from '~icons/sveltelab/threlte';
import Animotion from '~icons/fluent-emoji-high-contrast/magic-wand';

export const template_icon_map = new Map(
	Object.entries({
		basic: Basic,
		lib: Lib,
		mdsvex: Mdsvex,
		openprops: OpenProps,
		tailwind: Tailwind,
		threlte: Threlte,
		melt_ui: Melt,
		typescript: Typescript,
		typescript_tailwind: [Typescript, Tailwind],
		animotion: Animotion,
	})
);

function capitalize(title: string) {
	return `${title.charAt(0).toUpperCase()}${title.substring(1)}`;
}

export function fix_title(title: string) {
	return title.split('_').map(capitalize).join(' ');
}
