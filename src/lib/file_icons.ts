import File from '~icons/material-symbols/description-rounded';
import CSS from '~icons/vscode-icons/file-type-css';
import HTML from '~icons/vscode-icons/file-type-html';
import JS from '~icons/vscode-icons/file-type-js-official';
import JSON from '~icons/mdi/code-json';
import Svelte from '~icons/vscode-icons/file-type-svelte';
import Tailwind from '~icons/vscode-icons/file-type-tailwind';
import TS from '~icons/vscode-icons/file-type-typescript-official';
import Vite from '~icons/vscode-icons/file-type-vite';
import FolderLib from '~icons/material-icon-theme/folder-lib';
import FolderLibOpen from '~icons/material-icon-theme/folder-lib-open';
import FolderRoutes from '~icons/material-icon-theme/folder-routes';
import FolderRoutesOpen from '~icons/material-icon-theme/folder-routes-open';
import FolderSrc from '~icons/material-icon-theme/folder-src';
import FolderSrcOpen from '~icons/material-icon-theme/folder-src-open';
import FolderStatic from '~icons/material-icon-theme/folder-resource';
import FolderStaticOpen from '~icons/material-icon-theme/folder-resource-open';
import Folder from '~icons/material-symbols/folder-rounded';
import FolderOpen from '~icons/material-symbols/folder-open-rounded';
import type { SvelteComponent } from 'svelte';

const file_icons = new Map<RegExp, typeof File>([
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

export function get_file_icon(filename: string) {
	for (const [regex, component] of file_icons.entries()) {
		if (regex.test(filename)) {
			return component;
		}
	}
}

const folder_icons = new Map<
	RegExp,
	{ closed: typeof SvelteComponent; open?: typeof SvelteComponent }
>([
	[/lib$/, { closed: FolderLib, open: FolderLibOpen }],
	[/src$/, { closed: FolderSrc, open: FolderSrcOpen }],
	[/static$/, { closed: FolderStatic, open: FolderStaticOpen }],
	[/routes$/, { closed: FolderRoutes, open: FolderRoutesOpen }],
	[/.*/, { closed: Folder, open: FolderOpen }]
]);
export function get_folder_icon(filename: string, open?: boolean) {
	for (const [regex, component] of folder_icons.entries()) {
		if (!regex.test(filename)) continue;
		if (open && component.open) return component.open;
		return component.closed;
	}
}
