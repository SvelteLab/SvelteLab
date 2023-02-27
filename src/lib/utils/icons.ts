import File from '~icons/akar-icons/file';
import Ts from '~icons/vscode-icons/file-type-typescript-official';
import Js from '~icons/vscode-icons/file-type-js-official';
import Svelte from '~icons/vscode-icons/file-type-svelte';
import Vite from '~icons/vscode-icons/file-type-vite';

const icon_maps = new Map<RegExp, typeof File>([
	[/vite\.config\.(ts|js)$/, Vite],
	[/svelte\.config\.(ts|js)$/, Svelte],
	[/.*\.svelte$/, Svelte],
	[/.*\.ts$/, Ts],
	[/.*\.js$/, Js],
	[/.*/, File],
]);
export function get_icon(filename: string) {
	for (const [regex, component] of icon_maps.entries()) {
		if (regex.test(filename)) {
			return component;
		}
	}
}