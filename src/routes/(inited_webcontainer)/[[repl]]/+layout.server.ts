import type { FileSystemTree } from "@webcontainer/api";
import type { LayoutServerLoad } from "./$types";

export const ssr = false;

export const load: LayoutServerLoad = async ({ params }) => {
	const { repl } = params;
	let replFiles: FileSystemTree | undefined;
	if (repl) {
		console.log("Getting repl files");
		replFiles = {
			'test': {
				directory: {
					'test.js': {
						file: {
							contents: "console.log(42)"
						},
						open: true,
					}
				}
			}
		};
	}
	return {
		repl: replFiles,
	};
};