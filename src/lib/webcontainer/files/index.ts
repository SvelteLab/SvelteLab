import { package_json } from "./package_json";
import type { FileSystemTree } from "@webcontainer/api";
import { vite_config } from "./vite_config_ts";
import { svelte_config } from "./svelte_config_js";
import { app_html } from "./app_html";
import { page_svelte } from "./page_svelte";
import { page_server_ts } from "./page_server_ts";

export const files = {
	'src': {
		directory: {
			'routes': {
				directory: {
					'+page.server.ts': {
						file: {
							contents: page_server_ts,
						}
					},
					'+page.svelte': {
						file: {
							contents: page_svelte,
						}
					}
				}
			},
			'app.html': {
				file: {
					contents: app_html,
				}
			}
		}
	},
	'package.json': {
		file: {
			contents: package_json,
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
} satisfies FileSystemTree;