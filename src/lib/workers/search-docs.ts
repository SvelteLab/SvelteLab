import SearchDocsWorker from './search-docs-worker?worker';
import type { Tree } from './search';

export const search_docs_worker = new SearchDocsWorker();

export function get_search_docs() {
	search_docs_worker.postMessage({ type: 'init' });
	let fulfill: (result: Tree[]) => void;
	let ready: (result: (query: string) => Promise<Tree[]>) => void;
	const promise = new Promise<(query: string) => Promise<Tree[]>>((resolve) => {
		ready = resolve;
	});
	search_docs_worker.addEventListener('message', ({ data }) => {
		if (data.type === 'results') {
			if (typeof fulfill === 'function') {
				fulfill(data.payload.results);
			}
		} else if (data.type === 'ready') {
			if (typeof ready === 'function') {
				ready((query: string) => {
					search_docs_worker.postMessage({ type: 'query', payload: query });
					return new Promise<Tree[]>((resolve) => {
						fulfill = resolve;
					});
				});
			}
		}
	});
	return promise;
}
