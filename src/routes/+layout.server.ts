import { GITHUB_VERIFIER_COOKIE_NAME } from '$env/static/private';
import { templates } from '$lib/default_project_files';
import { REDIRECT_URI } from '$lib/env.server';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, depends, cookies }) => {
	depends('authed:user');

	if (locals.user) {
		return {
			user: locals.user,
			templates
		};
	}

	// if there no user we fetch the github login url and we save the code verifier
	// in a cookie
	const auth_methods = await locals.pocketbase.collection('users').listAuthMethods();
	const github_login = auth_methods.authProviders.find((p) => p.name === 'github');
	if (!github_login) throw Error('No authProvider with name "github" in pocketbase auth_methods');

	cookies.set(GITHUB_VERIFIER_COOKIE_NAME, github_login.codeVerifier, {
		httpOnly: true,
		path: '/'
	});

	return {
		github_login,
		REDIRECT_URI,
		templates
	};
};
