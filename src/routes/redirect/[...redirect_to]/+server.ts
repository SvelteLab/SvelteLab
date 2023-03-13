import { GITHUB_VERIFIER_COOKIE_NAME } from '$env/static/private';
import { PUBLIC_GITHUB_REDIRECT_URI } from '$env/static/public';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, url, cookies, params: { redirect_to } }) => {
	const code = url.searchParams.get('code');
	const code_verifier = cookies.get(GITHUB_VERIFIER_COOKIE_NAME);
	const auth_data = await locals.pocketbase
		.collection('users')
		.authWithOAuth2('github', code ?? '', code_verifier ?? '', PUBLIC_GITHUB_REDIRECT_URI);
	if (auth_data.meta) {
		const { name, avatarUrl } = auth_data.meta;
		await locals.pocketbase.collection('users').update(auth_data.record.id, {
			name,
			avatarUrl
		});
	}
	return new Response(null, {
		status: 301,
		headers: {
			location: `/${redirect_to}`
		}
	});
};
