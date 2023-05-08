import type { LayoutServerLoad } from './$types';

function assert_pages(
	pages: unknown
): asserts pages is { link: string; metadata?: Record<string, string> }[] {
	if (!Array.isArray(pages)) throw new Error('Pages is not an array');
	for (const page of pages) {
		if (!(page instanceof Object)) throw new Error(`Page ${page} is not an object`);
		if (!('link' in page)) throw new Error(`Page ${JSON.stringify(page)} doesn't have a link`);
	}
}

export const load = (async ({ fetch }) => {
	const pages = await fetch('/pages').then((res) => res.json());
	assert_pages(pages);
	return { pages };
}) satisfies LayoutServerLoad;
