import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

type ComponentModule = {
	metadata?: Record<string, string>;
};

function assert_component(maybe_component: unknown): asserts maybe_component is ComponentModule {
	if (!(maybe_component instanceof Object)) throw new Error('Not an object');
}

export const GET: RequestHandler = async () => {
	const pages_components = await import.meta.glob('$lib/pages/**/index.svx', {
		eager: true
	});
	const pages = Object.entries(pages_components).map(([page, component]) => {
		assert_component(component);
		return {
			link: page.split('/').at(-2),
			metadata: component.metadata
		};
	});
	return json(pages);
};
