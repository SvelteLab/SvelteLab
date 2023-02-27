import File from '~icons/akar-icons/file';
import JS from '~icons/vscode-icons/file-type-js-official';
import Svelte from '~icons/vscode-icons/file-type-svelte';
import TS from '~icons/vscode-icons/file-type-typescript-official';
import Vite from '~icons/vscode-icons/file-type-vite';
import CSS from '~icons/vscode-icons/file-type-css';
import JSON from '~icons/vscode-icons/file-type-json';
import HTML from '~icons/vscode-icons/file-type-html';

const icon_maps = new Map<RegExp, typeof File>([
	[/vite\.config\.(ts|js)$/, Vite],
	[/svelte\.config\.(ts|js)$/, Svelte],
	[/.*\.svelte$/, Svelte],
	[/.*\.ts$/, TS],
	[/.*\.js$/, JS],
	[/.*\.css$/, CSS],
	[/.*\.json$/, JSON],
	[/.*\.html$/, HTML],
	[/.*/, File]
]);

export function get_icon(filename: string) {
	for (const [regex, component] of icon_maps.entries()) {
		if (regex.test(filename)) {
			return component;
		}
	}
}
