import { GITHUB_VERIFIER_COOKIE_NAME } from '$lib/constants';
import { templates } from '$lib/default_project_files';
import { REDIRECT_URI } from '$lib/env.server';
import { ClientResponseError } from 'pocketbase';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, depends, cookies }) => {
	depends('authed:user');

	if (locals.user) {
		return {
			user: locals.user,
			templates,
		};
	}
	let github_login;

	// if there no user we fetch the github login url and we save the code verifier
	// in a cookie
	try {
		const auth_methods = await locals.pocketbase.collection('users').listAuthMethods();
		github_login = auth_methods.oauth2.providers.find((p) => p.name === 'github');
	} catch (e) {
		console.error(e);
		if (e instanceof ClientResponseError) {
			console.error(e.message);
			if (e.status === 0) console.error('Do you have pocketbase running?');
		}
	}

	if (github_login) {
		cookies.set(GITHUB_VERIFIER_COOKIE_NAME, github_login.codeVerifier, {
			httpOnly: true,
			path: '/',
		});
	}

	return {
		github_login,
		REDIRECT_URI,
		templates,
	};
};
