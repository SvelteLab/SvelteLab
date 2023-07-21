import { GITHUB_VERIFIER_COOKIE_NAME } from '$lib/constants';
import { REDIRECT_URI } from '$lib/env.server.js';
import { redirect } from '@sveltejs/kit';

export async function load({ locals, url, cookies, params: { redirect_to } }) {
	const code = url.searchParams.get('code');
	const port = url.searchParams.get('port');
	const code_verifier = cookies.get(GITHUB_VERIFIER_COOKIE_NAME);
	if (port) {
		return {
			port,
			code,
		};
	}
	console.log({ code, code_verifier, REDIRECT_URI });
	let auth_data;
	try {
		auth_data = await locals.pocketbase
			.collection('users')
			.authWithOAuth2Code('github', code ?? '', code_verifier ?? '', REDIRECT_URI);
	} catch (e) {
		console.log('error', e);
	}
	if (auth_data?.meta) {
		const { name, avatarUrl: avatar_url } = auth_data.meta;
		try {
			await locals.pocketbase.collection('users').update(auth_data.record.id, {
				name,
				avatarUrl: avatar_url,
			});
		} catch (e) {
			console.log(e);
		}
	}
	throw redirect(302, `/${redirect_to}?login=true`);
}
