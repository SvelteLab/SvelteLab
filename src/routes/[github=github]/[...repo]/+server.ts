import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	// get repo owner, name branch and path from the path
	const github_regex =
		/(?<owner>[^/]+)\/(?<repo>[^/]+)\/?(?:tree\/(?<branch>[^/]+))?(?<path>\/.*)?/;
	const info = params.repo.match(github_regex)?.groups;
	const search_params = new URLSearchParams();
	search_params.set('provider', 'github');
	for (const group in info) {
		if (info[group]) {
			search_params.set(group, info[group]);
		}
	}
	throw redirect(301, `/?${search_params}`);
};
