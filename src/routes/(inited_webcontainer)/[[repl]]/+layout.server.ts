import type { FileSystemTree } from '@webcontainer/api';
import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import type { Actions } from '../$types';
import { GITHUB_VERIFIER_COOKIE_NAME } from '$env/static/private';
import { dev } from '$app/environment';

export const ssr = false;

function get_repl_from_id(id: string) {
	const repls: Record<string, FileSystemTree> = {
		'random-id': {
			test: {
				directory: {
					'test.js': {
						file: {
							contents: 'console.log(42)'
						},
						open: true
					}
				}
			}
		},
		'another-id': {
			another: {
				directory: {
					'id.js': {
						file: {
							contents: 'console.log(42)'
						},
						open: true
					}
				}
			},
			'package.json': {
				file: {
					contents: JSON.stringify({
						scripts: {
							dev: 'node ./another/id.js'
						}
					})
				}
			}
		}
	};
	return repls[id];
}

export const load: LayoutServerLoad = async ({ params, locals, cookies }) => {
	const { repl } = params;
	let repl_files: FileSystemTree | undefined;
	if (repl) {
		repl_files = get_repl_from_id(repl);
	}
	if (repl && !repl_files) {
		throw redirect(300, '/');
	}
	let github_login;
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
		repl: repl_files,
		github_login
	};
};
