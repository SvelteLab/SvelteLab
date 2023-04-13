import { init, search } from './search';

addEventListener('message', async (event) => {
	const { type, payload } = event.data;

	if (type === 'init') {
		const res = await fetch(`https://kit.svelte.dev/content.json`);
		const { blocks } = await res.json();
		init(blocks);

		postMessage({ type: 'ready' });
	}

	if (type === 'query') {
		const query = payload;
		const results = search(query);

		postMessage({ type: 'results', payload: { results, query } });
	}
});
