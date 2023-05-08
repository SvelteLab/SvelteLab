import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { SvelteComponentTyped, ComponentType } from 'svelte';

export function entries() {
	// we just need the first slug, the rest will be crawled
	return [{ slug: '' }];
}

export const load = (async ({ params: { slug = 'getting-started' }, parent }) => {
	let page;
	try {
		page = (await import(`../../lib/pages/${slug}/index.svx`))
			.default as ComponentType<SvelteComponentTyped>;
	} catch (e) {
		throw error(404);
	}
	const page_info = (await parent()).pages.find((page) => page.link === slug);
	return { page, page_info };
}) satisfies PageLoad;
