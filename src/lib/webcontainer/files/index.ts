import type { DirectoryNode, FileNode, FileSystemTree } from '@webcontainer/api';
import { app_html } from './app_html';
import { global_css } from './global_css';
import { package_json } from './package_json';
import { page_server_ts } from './page_server_ts';
import { page_svelte } from './page_svelte';
import { svelte_config } from './svelte_config_js';
import { vite_config } from './vite_config_ts';

export interface DirectoryNodeWithOpen extends DirectoryNode {
	open?: boolean;
}
export interface FileNodeWithOpen extends FileNode {
	open?: boolean;
}

export interface FileSystemTreeWithOpens extends FileSystemTree {
	[name: string]: DirectoryNodeWithOpen | FileNodeWithOpen;
}

export const files = {
	src: {
		directory: {
			routes: {
				directory: {
					'+page.server.ts': {
						file: {
							contents: page_server_ts
						}
					},
					'+page.svelte': {
						file: {
							contents: page_svelte
						}
					},
					'global.css': {
						file: {
							contents: global_css
						}
					}
				}
			},
			'app.html': {
				file: {
					contents: app_html
				}
			}
		}
	},
	'package.json': {
		file: {
			contents: package_json
		}
	},
	'vite.config.ts': {
		file: {
			contents: vite_config
		}
	},
	'svelte.config.js': {
		file: {
			contents: svelte_config
		}
	}
} satisfies FileSystemTreeWithOpens;
