import { GITHUB_VERIFIER_COOKIE_NAME } from '$lib/constants';
import { templates } from '$lib/default_project_files';
import { REDIRECT_URI } from '$lib/env.server';
import { ClientResponseError } from 'pocketbase';
import { categorized_repls_schema } from '$lib/schemas';
import type { LayoutServerLoad } from './$types';
import type PoketBase from 'pocketbase';

async function get_folders_from_user(pocketbase: PoketBase) {
	const record = await pocketbase.collection('categorized_repls').getFullList();
	return categorized_repls_schema.parse(record);
}

export const load: LayoutServerLoad = async ({ locals, depends, cookies }) => {
	depends('authed:user');
	depends('user:repls');
	if (locals.user) {
		const categorized_repls = get_folders_from_user(locals.pocketbase);
		return {
			user: locals.user,
			templates,
			promises: {
				categorized_repls
			}
		};
	}
	let github_login;

	// if there no user we fetch the github login url and we save the code verifier
	// in a cookie
	try {
		const auth_methods = await locals.pocketbase.collection('users').listAuthMethods();
		github_login = auth_methods.authProviders.find((p) => p.name === 'github');
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
