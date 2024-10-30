import { error } from '@sveltejs/kit';
import type { Component } from 'svelte';
import type { PageLoad } from './$types';

export function entries() {
	// we just need the first slug, the rest will be crawled
	return [{ slug: '' }];
}

export const load = (async ({ params: { slug = 'welcome' }, parent }) => {
	let page;
	try {
		page = (await import(`../../lib/pages/${slug}/index.svx`)).default as Component;
	} catch (e) {
		throw error(404);
	}
	const page_info = (await parent()).pages.find((page) => page.link === slug);
	return { page, page_info };
}) satisfies PageLoad;
