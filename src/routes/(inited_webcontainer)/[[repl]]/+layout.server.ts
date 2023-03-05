import type { FileSystemTree } from '@webcontainer/api';
import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

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

export const load: LayoutServerLoad = async ({ params }) => {
	const { repl } = params;
	let replFiles: FileSystemTree | undefined;
	if (repl) {
		replFiles = get_repl_from_id(repl);
	}
	if (repl && !replFiles) {
		throw redirect(300, '/');
	}
	return {
		repl: replFiles
	};
};
