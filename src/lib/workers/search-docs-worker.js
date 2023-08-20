import { init, search, inited } from './search';

addEventListener('message', async (event) => {
	const { type, payload } = event.data;

	if (type === 'init') {
		const where = payload;
		if (!where || typeof where !== 'string' || (where !== 'svelte' && where !== 'sveltekit')) {
			return;
		}
		// no reason to re-init if it's already inited
		if (!inited[where]) {
			const res = await fetch(
				where === 'sveltekit'
					? `https://kit.svelte.dev/content.json`
					: 'https://svelte.dev/content.json',
			);
			const { blocks } = await res.json();
			init(blocks, where);
		}

		postMessage({ type: 'ready' });
	}

	if (type === 'query') {
		const { query, where } = payload;
		const results = search(query, where);

		postMessage({ type: 'results', payload: { results, query } });
	}
});
