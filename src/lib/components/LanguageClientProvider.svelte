<script context="module" lang="ts">
	import { WorkerRPC } from 'svelte-language-server-web';

	export type LanguageClientContext = {
		/**
		 * The current document uri, formatted as `file:///path/to/file.ext`
		 */
		document_uri: Readable<string>;
		/**
		 * A promise that resolves when the language servers have been setup
		 */
		setup_complete: Promise<void>;
		/**
		 * Extensions for use within the CodeMirror editor
		 */
		extensions: Writable<Extension[]>;
		/** Opens a document with the LSP client */
		get_language_client: (uri: string) => Promise<void>;
		/**
		 * - if `true` then the browser supports using the Language Server
		 * - if `false` then the browser does not support using the Language Server,
		 * and the Language Client Provider should not be used.
		 */
		supports_lsp: Readable<boolean>;
		/**
		 *  Notifies the Language Servers that a file has been deleted
		 */
		delete_lsp_file: (uri: string) => Promise<void>;
		/**
		 *  Notifies the Language Servers that a file has been updated
		 */
		update_lsp_file: (uri: string, contents: string) => Promise<void>;
	};

	export const lang_keys = [
		'svelte',
		'svx',
		'html',
		'js',
		'cjs',
		'mjs',
		'ts',
		'css',
		'postcss',
		'json',
		'md',
	] as const;

	export const lang_map = {
		svelte: 'svelte',
		svx: 'svelte',
		html: 'html',
		js: 'javascript',
		cjs: 'javascript',
		mjs: 'javascript',
		ts: 'typescript',
		css: 'css',
		postcss: 'css',
		json: 'json',
		md: 'markdown',
	} as const;

	export const supported_languages = lang_keys;
	export type SupportedFileExtension = (typeof lang_keys)[number];
	export type SupportedLanguage = (typeof lang_map)[SupportedFileExtension];

	export const is_supported_editor_file_ext = (
		lang: string | undefined,
	): lang is SupportedFileExtension => supported_languages.includes(lang as never);

	export const is_supported_editor_lang = (lang: string | undefined): lang is SupportedLanguage =>
		lang ? lang in lang_map : false;

	export const is_lsp_file_type = (document_uri: string) =>
		['.js', '.ts', '.cjs', '.mjs', '.svelte', '.svx'].some((ext) => document_uri.endsWith(ext));

	export const get_current_lang = ($document_uri: string): SupportedLanguage | undefined => {
		const current_lang = $document_uri.split('.').at(-1) ?? '';
		const lang = is_supported_editor_file_ext(current_lang) ? lang_map[current_lang] : undefined;
		return lang;
	};

	/**
	 * Returns the current file extension, if supported.
	 * Otherwise, returns `undefined`
	 */
	export const get_current_file_ext = (
		$document_uri: string,
	): SupportedFileExtension | undefined => {
		const current_lang = $document_uri.split('.').at(-1) ?? '';
		const lang = is_supported_editor_file_ext(current_lang) ? current_lang : undefined;
		return lang;
	};

	function supports_module_workers() {
		let supports = false;
		const tester = {
			get type() {
				supports = true;
				return supports ? 'module' : 'classic';
			}, // it's been called, it's supported
		};
		try {
			new Worker('data:,', tester).terminate();
		} catch {
			console.log('Unsupported browser for language server usage, disabling...');
		}

		return supports;
	}

	const to_absolute_path = (path: string) => path.replace('./', '/');

	const LANGUAGE_CLIENT_CONTEXT = Symbol.for('svelte_language_worker');

	const extensions = writable<Extension[]>([]);
	const lang_clients = new Map<string, Extension[]>();

	let svelte_language_worker: Worker;
	let typescript_language_worker: Worker;

	let svelte_transport: WorkerRPC;
	let ts_transport: WorkerRPC;

	const throttle = <T,>(func: (...args: T[]) => void, wait: number) => {
		let timeout: ReturnType<typeof setTimeout> | undefined;

		return (...args: T[]) => {
			if (timeout) return;
			timeout = setTimeout(() => {
				func(...args);
				timeout = undefined;
			}, wait);
		};
	};

	const async_mutex = <A, R>(func: (...args: A[]) => Promise<R>) => {
		let active_tasks = 0;

		const queue: (() => Promise<void>)[] = [];

		const run_task = async (f: () => Promise<void>) => {
			active_tasks++;
			try {
				await f();
			} finally {
				active_tasks--;
				run_next();
			}
		};

		function run_next() {
			if (active_tasks <= 1 && queue.length > 0) {
				const next = queue.shift();
				if (next) run_task(next);
			}
		}

		return (...args: A[]): Promise<R> => {
			return new Promise((resolve, reject) => {
				const wrapped_task = async () => {
					try {
						const result = await func(...args);
						resolve(result);
					} catch (error) {
						reject(error);
					}
				};

				queue.push(wrapped_task);
				run_next();
			});
		};
	};

	/**
	 * Converts a path to a file url
	 *
	 * @example
	 * ```typescript
	 * to_file_url('./foo/bar.ts') // file:///foo/bar.ts
	 * to_file_url('/foo/bar.ts') // file:///foo/bar.ts
	 * to_file_url('file:///foo/bar.ts') // file:///foo/bar.ts
	 * ```
	 */
	const to_file_url = (path: string) => {
		if (path.startsWith('file://')) {
			return path;
		} else if (path.startsWith('.') || path.startsWith('..')) {
			return `${path.replace(/\.\.?\//, 'file:///')}`;
		} else if (path.startsWith('/')) {
			return `file://${path}`;
		}
		return `file:///${path.replace('./', '')}`;
	};

	const race = <T,>(timeout: number, callback: Promise<T>) =>
		Promise.race<T>([new Promise((r) => setTimeout(r, timeout)), callback]);

	const create_language_servers = () => {
		const is_supported = supports_module_workers();

		const setup = () => {
			if (!is_supported) return { svelte_transport, ts_transport };
			if (ts_transport && svelte_transport) return { svelte_transport, ts_transport };

			typescript_language_worker = new Worker(
				new URL('../workers/typescript-language-server.js', import.meta.url),
				{ type: 'module' },
			);
			svelte_language_worker = new Worker(
				new URL('../workers/svelte-language-server.js', import.meta.url),
				{
					type: 'module',
				},
			);

			svelte_transport = new WorkerRPC(svelte_language_worker, {
				rootUri: 'file:///',
				workspaceFolders: [{ uri: 'file:///', name: 'root' }],
				documentUri: '',
				languageId: '',
				allowHTMLContent: true,
			} as never);
			ts_transport = new WorkerRPC(typescript_language_worker, {
				rootUri: 'file:///',
				workspaceFolders: [{ uri: 'file:///', name: 'root' }],
				documentUri: '',
				languageId: '',
				allowHTMLContent: true,
			} as never);

			return { svelte_transport, ts_transport };
		};

		/**
		 * 	Cleanup the language servers, the RPC channels used to communicate with them, as well
		 *  as explicitly clearing out any strong references to any of the previously mentioned
		 *
		 *  This is necessary because the language servers are long-lived processes that will not
		 *  be garbage collected unless we explicitly tell them to close
		 */
		const dispose = () => {
			if (!is_supported) return;
			// Close the RPC channels, which will in turn close the language servers
			svelte_transport.close();
			ts_transport.close();

			// Terminate the language server workers, avoiding long-lived orphan/zombie processes
			svelte_language_worker.terminate();
			typescript_language_worker.terminate();

			// Ensure that the language client, and their CM extensions are no longer referenced
			lang_clients.clear();

			// Clear out the extensions store, since we're more than likely going to teardown
			// the whole editor
			extensions.set([]);

			// Safety net
			current_language_transport = undefined;
		};

		return { setup, dispose, is_supported };
	};

	let current_language_transport: Extension[] | undefined;
</script>

<script lang="ts">
	import { current_tab } from '$lib/tabs';
	import { deferred_promise } from '$lib/utils';
	import { webcontainer } from '$lib/webcontainer';
	import type { Extension } from '@codemirror/state';
	import { languageServerWithTransport } from 'codemirror-languageserver';
	import { onMount, setContext } from 'svelte';
	import { derived, writable, type Readable, type Writable } from 'svelte/store';

	// Swap out the current language client with the new one
	const update_extensions_with_client = (client: Extension[]) => {
		extensions.update(($extensions) => [
			...$extensions.filter((ext) => ext !== current_language_transport),
			client,
		]);
	};

	// The transports used to communicate with the language servers
	let svelte_transport: WorkerRPC;
	let ts_transport: WorkerRPC;

	let supports_lsp = writable(false);

	// Both variables are used for properly creating a fallback tsconfig/jsconfig
	let project_is_sveltekit = false;
	let project_is_typescript = false;

	// Lets us know when the language client is ready
	// and all initialization procedures have been completed
	const setup_completed = deferred_promise();
	let resolved = false;

	// Helper for determining if a path is a tsconfig.json or jsconfig.json
	const is_tsconfig_or_jsconfig = (path: string) =>
		(path.includes('tsconfig.') || path.includes('jsconfig.')) && path.endsWith('.json');

	// Store the current document uri formatted as `file:///path/to/file.ext`
	const document_uri = derived(current_tab, ($current_tab) => to_file_url($current_tab));

	/** Sends the 'setup' RPC message to the language servers,
	 * 	and adds the project files + config files to the language servers
	 */
	const setup = async (config_files: Record<string, string>, files: Record<string, string> = {}) =>
		new Promise((resolve) => {
			const ready = () => {
				setup_completed.resolve(true);
				resolved = true;
				resolve(undefined);
			};

			race(
				1000,
				Promise.all<unknown[]>([
					svelte_transport.addFiles({ ...config_files, ...files }),
					svelte_transport.setup(config_files),
					ts_transport.setup(config_files),
				]),
			).then(ready);
		});

	const get_language_client = () => {
		const reset_language_transport = () => {
			update_extensions_with_client([]);
			current_language_transport = undefined;
		};

		const create_new_client = async ($document_uri: string) => {
			const current_ext = get_current_file_ext($document_uri);
			const lang = get_current_lang($document_uri);

			if (!current_ext || !lang || !is_lsp_file_type($document_uri)) {
				reset_language_transport();
				return;
			}

			const ts_or_js = lang === 'javascript' || lang === 'typescript';

			const is_svelte = lang === 'svelte';
			const transport = ts_or_js ? ts_transport : is_svelte ? svelte_transport : undefined;

			if (!transport) {
				reset_language_transport();
				return;
			}

			// Create a new language client transport for the current tab if one doesn't exist
			const client = languageServerWithTransport({
				transport: transport as never,
				rootUri: 'file:///',
				workspaceFolders: [{ uri: 'file:///', name: 'root' }],
				documentUri: $document_uri,
				languageId: is_svelte ? 'svelte' : ts_or_js ? 'typescript' : '',
				allowHTMLContent: true,
				client: transport.client(),
				autoClose: false,
			});

			// Add the new language client to the language client map
			lang_clients.set($document_uri, client);

			update_extensions_with_client(client);
			current_language_transport = client;
		};

		const get_existing_client = ($document_uri: string) => {
			const client = lang_clients.get($document_uri);

			// If the current language client is not the same as the one for the current tab,
			// swap them out
			if (client && current_language_transport !== client) {
				update_extensions_with_client(client);

				current_language_transport = client;
			}
		};

		return async ($document_uri: string) => {
			await setup_completed.promise;
			if (lang_clients.has($document_uri)) {
				get_existing_client($document_uri);
			} else {
				await create_new_client($document_uri);
			}
		};
	};

	function setup_fresh_project(files: Record<string, string> = {}) {
		if (resolved) return;
		const configs: Record<string, string> = {};

		const has_svelte_kit_dotfiles = (() => {
			let resolved = false;
			return (files: Record<string, string>) => {
				const keys = Object.keys(files);
				const result =
					!resolved &&
					keys.length >= 4 &&
					keys.some((file) =>
						file.match(
							/(\.svelte-kit(\/tsconfig\.json|\/types)?|route_meta_data|\$types.d.ts|ambient\.d\.ts|types|svelte\.config\.js)/,
						),
					);
				if (result) resolved = true;
				return result;
			};
		})();

		// Listen for changes to SK-specific type files
		const listen_for_type_changes = webcontainer.on_fs_change(
			'modification',
			throttle(async (path) => {
				if (path.includes('.svelte-kit/')) {
					const file = await webcontainer.read_file(path, true);
					svelte_transport.addFiles({ [to_absolute_path(path)]: file });
				}
			}, 250),
		);

		const on_config_callback = async (path: string) => {
			const absolute_path = to_absolute_path(path);
			if (
				is_tsconfig_or_jsconfig(path) ||
				path === './svelte.config.js' ||
				path === './.svelte-kit/ambient.d.ts' ||
				path.startsWith('./.svelte-kit/')
			) {
				await webcontainer.read_file(path, true).then((file) => {
					configs[absolute_path] = file;
				});
			}
			if (has_svelte_kit_dotfiles(configs) || !project_is_sveltekit) {
				configs[absolute_path] = await webcontainer.read_file(path, true);

				if (!files['/tsconfig.json'] && !files['/jsconfig.json']) {
					files[project_is_typescript ? '/tsconfig.json' : '/jsconfig.json'] = `
						{
							${project_is_sveltekit ? `"extends": "./.svelte-kit/tsconfig.json",` : ''}
							"compilerOptions": {
								"allowJs": true,
								"checkJs": true,
								"esModuleInterop": true,
								"forceConsistentCasingInFileNames": true,
								"resolveJsonModule": true,
								"skipLibCheck": true,
								"sourceMap": true,
								"strict": true
							},
							"include": ["**/**/*/*.d.ts", "**/*.ts", "**/*.js", "**/*.svelte"],
						}`;
				}
				setup(configs, files);
			} else {
				configs[absolute_path] = await webcontainer.read_file(path, true);
				await svelte_transport.addFiles({ [absolute_path]: configs[absolute_path] });
			}
		};

		// We use the mutex here to ensure things are executed one at a time
		const mutex = async_mutex<string, void>((path) => on_config_callback(path));

		const listen_for_configs = webcontainer.on_fs_change('creation', mutex);

		return { listen_for_configs, listen_for_type_changes };
	}

	onMount(() => {
		let listen_for_configs: () => void | undefined;
		let listen_for_type_changes: () => void | undefined;

		const worker_handlers = create_language_servers();

		const workers = worker_handlers.setup();

		({ svelte_transport, ts_transport } = workers);

		supports_lsp.set(worker_handlers.is_supported);

		if (!$supports_lsp) {
			setup_completed.resolve(true);
			resolved = true;

			return;
		}

		const handle_config_changes = webcontainer.on_init(async () => {
			const tree = await webcontainer.get_tree_from_container(true, false);
			const files = webcontainer.walk_tree_and_collect(tree);

			webcontainer.read_package_json().then(async (json) => {
				await Promise.all([
					svelte_transport.fetchTypes(json),
					ts_transport.fetchTypes(json),
					svelte_transport.addFiles(files),
					ts_transport.addFiles(files),
				]);

				if (typeof json === 'object' && 'devDependencies' in json) {
					if (json.devDependencies['@sveltejs/kit']) {
						project_is_sveltekit = true;
					}
					if (json.devDependencies['typescript']) {
						project_is_typescript = true;
					}
				}

				if (Object.keys(files).some((file) => file.includes('.svelte-kit/'))) {
					await setup(files);
				} else {
					const setup_listeners = setup_fresh_project(files);

					if (setup_listeners) {
						({ listen_for_configs, listen_for_type_changes } = setup_listeners);
					}
				}
			});
		});

		return () => {
			if (typeof handle_config_changes === 'function') handle_config_changes();
			if (typeof listen_for_configs === 'function') listen_for_configs();
			if (typeof listen_for_type_changes === 'function') listen_for_type_changes();
		};
	});

	setContext(LANGUAGE_CLIENT_CONTEXT, {
		extensions,
		document_uri,
		get_language_client: get_language_client(),
		setup_complete: setup_completed.promise,
		supports_lsp: derived(supports_lsp, ($supports_lsp) => $supports_lsp),
		delete_lsp_file: async (uri: string) => {
			if (!$supports_lsp) throw new Error('Language Server not supported');
			await Promise.all([
				svelte_transport.deleteFile(to_absolute_path(uri)),
				ts_transport.deleteFile(to_absolute_path(uri)),
			]);
		},
		update_lsp_file: async (uri: string, contents: string) => {
			if (!$supports_lsp) throw new Error('Language Server not supported');

			await Promise.all([
				svelte_transport.addFiles({ [to_absolute_path(uri)]: contents }),
				ts_transport.addFiles({ [to_absolute_path(uri)]: contents }),
			]);
		},
	} as LanguageClientContext);
</script>

<slot />
