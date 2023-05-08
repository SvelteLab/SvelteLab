import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { SvelteComponentTyped, ComponentType } from 'svelte';

export const load = (async ({ params: { slug = 'getting-started' } }) => {
	let page;
	try {
		page = (await import(`../../lib/pages/${slug}/index.svx`))
			.default as ComponentType<SvelteComponentTyped>;
	} catch (e) {
		throw error(404);
	}
	return { page };
}) satisfies PageLoad;
