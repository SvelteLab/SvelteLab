import File from '~icons/material-symbols/description-rounded';
import CSS from '~icons/vscode-icons/file-type-css';
import HTML from '~icons/vscode-icons/file-type-html';
import JS from '~icons/vscode-icons/file-type-js-official';
import JSON from '~icons/vscode-icons/file-type-json';
import Svelte from '~icons/vscode-icons/file-type-svelte';
import Tailwind from '~icons/vscode-icons/file-type-tailwind';
import TS from '~icons/vscode-icons/file-type-typescript-official';
import Vite from '~icons/vscode-icons/file-type-vite';
import FolderLib from '~icons/vscode-material-icon-theme/folder-lib';
import FolderRoutes from '~icons/vscode-material-icon-theme/folder-routes';
import FolderSrc from '~icons/vscode-material-icon-theme/folder-src';
import Folder from '~icons/material-symbols/folder-rounded';

const folder_icons = new Map<RegExp, typeof File>([
	[/lib$/, FolderLib],
	[/src$/, FolderSrc],
	[/routes$/, FolderRoutes],
	[/.*/, Folder]
]);

const icons = new Map<RegExp, typeof File>([
	[/vite\.config\.(ts|js)$/, Vite],
	[/tailwind\.config\.(cjs|js)$/, Tailwind],
	[/svelte\.config\.(ts|js)$/, Svelte],
	[/.*\.svelte$/, Svelte],
	[/.*\.ts$/, TS],
	[/.*\.(js|cjs|mjs)$/, JS],
	[/.*\.css$/, CSS],
	[/.*\.json$/, JSON],
	[/.*\.html$/, HTML],
	[/.*/, File]
]);

export function get_folder_icon(filename: string) {
	for (const [regex, component] of folder_icons.entries()) {
		if (regex.test(filename)) {
			return component;
		}
	}
}

export function get_icon(filename: string) {
	for (const [regex, component] of icons.entries()) {
		if (regex.test(filename)) {
			return component;
		}
	}
}
