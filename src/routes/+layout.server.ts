import { GITHUB_VERIFIER_COOKIE_NAME } from '$env/static/private';
import type { PageServerLoad } from './(inited_webcontainer)/$types';

export const load: PageServerLoad = async ({ locals, depends, cookies }) => {
	depends('authed:user');
	let github_login;
	// if there no user we fetch the github login url and we save the code verifier
	// in a cookie
	if (!locals.user) {
		github_login = await (
			await locals.poket_base.collection('users').listAuthMethods()
		)?.authProviders?.find?.((provider) => provider.name === 'github');
		if (github_login?.codeVerifier) {
			cookies.set(GITHUB_VERIFIER_COOKIE_NAME, github_login.codeVerifier, {
				path: '/'
			});
		}
	}
	return {
		user: locals.user,
		github_login
	};
};
