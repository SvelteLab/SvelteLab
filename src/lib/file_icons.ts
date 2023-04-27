import type { SvelteComponent } from 'svelte';
import FolderLib from '~icons/material-icon-theme/folder-lib';
import FolderLibOpen from '~icons/material-icon-theme/folder-lib-open';
import FolderStatic from '~icons/material-icon-theme/folder-resource';
import FolderStaticOpen from '~icons/material-icon-theme/folder-resource-open';
import FolderRoutes from '~icons/material-icon-theme/folder-routes';
import FolderRoutesOpen from '~icons/material-icon-theme/folder-routes-open';
import FolderServer from '~icons/material-icon-theme/folder-server';
import FolderServerOpen from '~icons/material-icon-theme/folder-server-open';
import FolderSrc from '~icons/material-icon-theme/folder-src';
import FolderSrcOpen from '~icons/material-icon-theme/folder-src-open';
import File from '~icons/material-symbols/description-rounded';
import FolderOpen from '~icons/material-symbols/folder-open-rounded';
import Folder from '~icons/material-symbols/folder-rounded';
import Images from '~icons/material-symbols/imagesmode';
import JSON from '~icons/mdi/code-json';
import LayoutScript from '~icons/r-icons/script_layout';
import LayoutServer from '~icons/r-icons/script_layout_server';
import PageScript from '~icons/r-icons/script_page';
import PageServer from '~icons/r-icons/script_page_server';
import Server from '~icons/r-icons/script_server';
import Error from '~icons/r-icons/svelte_error';
import Layout from '~icons/r-icons/svelte_layout';
import Page from '~icons/r-icons/svelte_page';
import Prettier from '~icons/simple-icons/prettier';
import CSS from '~icons/vscode-icons/file-type-css';
import HTML from '~icons/vscode-icons/file-type-html';
import PostCSS from '~icons/vscode-icons/file-type-postcss';
import JS from '~icons/vscode-icons/file-type-js-official';
import Svelte from '~icons/vscode-icons/file-type-svelte';
import Tailwind from '~icons/vscode-icons/file-type-tailwind';
import TS from '~icons/vscode-icons/file-type-typescript-official';
import Vite from '~icons/vscode-icons/file-type-vite';

const file_icons = new Map<RegExp, typeof File>([
	[/\+layout\.(ts|js)$/, LayoutScript],
	[/\+layout\.server\.(ts|js)$/, LayoutServer],
	[/\+layout\.svelte$/, Layout],
	[/\+page\.server\.(ts|js)$/, PageServer],
	[/\+page\.(ts|js)$/, PageScript],
	[/\+page\.svelte$/, Page],
	[/\+server\.(ts|js)$/, Server],
	[/\+error\.svelte$/, Error],
	[/vite\.config\.(ts|js)$/, Vite],
	[/tailwind\.config\.(cjs|js)$/, Tailwind],
	[/svelte\.config\.(ts|js)$/, Svelte],
	[/\.prettierrc$/, Prettier],
	[/.*\.svelte$/, Svelte],
	[/.*\.ts$/, TS],
	[/^postcss\.(js|cjs|mjs)$/, PostCSS],
	[/.*\.postcss$/, PostCSS],
	[/.*\.(js|cjs|mjs)$/, JS],
	[/.*\.(jpe?g|png|gif|bmp)$/, Images],
	[/.*\.css$/, CSS],
	[/.*\.json$/, JSON],
	[/.*\.html$/, HTML],
	[/.*/, File],
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
	[/server$/, { closed: FolderServer, open: FolderServerOpen }],
	[/routes$/, { closed: FolderRoutes, open: FolderRoutesOpen }],
	[/.*/, { closed: Folder, open: FolderOpen }],
]);
export function get_folder_icon(filename: string, open?: boolean) {
	for (const [regex, component] of folder_icons.entries()) {
		if (!regex.test(filename)) continue;
		if (open && component.open) return component.open;
		return component.closed;
	}
}
