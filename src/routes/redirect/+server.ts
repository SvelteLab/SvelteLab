import { GITHUB_VERIFIER_COOKIE_NAME } from '$env/static/private';
import { PUBLIC_GITHUB_REDIRECT_URI } from '$env/static/public';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, url, cookies }) => {
	const code = url.searchParams.get('code');
	const code_verifier = cookies.get(GITHUB_VERIFIER_COOKIE_NAME);
	await locals.poket_base
		.collection('users')
		.authWithOAuth2('github', code ?? '', code_verifier ?? '', PUBLIC_GITHUB_REDIRECT_URI);
	return new Response(null, {
		status: 301,
		headers: {
			location: '/'
		}
	});
};
