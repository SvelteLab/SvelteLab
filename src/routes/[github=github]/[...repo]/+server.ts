import { build_import_href } from '$lib/github_import_regex';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ params }) => {
	redirect(301, build_import_href(params.repo));
};
