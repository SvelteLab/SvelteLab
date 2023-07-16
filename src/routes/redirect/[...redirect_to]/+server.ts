import { GITHUB_VERIFIER_COOKIE_NAME } from '$lib/constants';
import { REDIRECT_URI } from '$lib/env.server';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, url, cookies, params: { redirect_to } }) => {
	const code = url.searchParams.get('code');
	const code_verifier = cookies.get(GITHUB_VERIFIER_COOKIE_NAME);
	const auth_data = await locals.pocketbase
		.collection('users')
		.authWithOAuth2('github', code ?? '', code_verifier ?? '', REDIRECT_URI);
	if (auth_data.meta) {
		const { name, avatarUrl } = auth_data.meta;
		await locals.pocketbase.collection('users').update(auth_data.record.id, {
			name,
			avatarUrl,
		});
	}
	return new Response(null, {
		status: 302,
		headers: {
			location: `/${redirect_to}?login=true`,
		},
	});
};
