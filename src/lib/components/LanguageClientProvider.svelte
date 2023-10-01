<script context="module" lang="ts">
	import { WorkerRPC } from 'svelte-language-server-web';
	import SvelteLanguageWorkerURL from '$lib/workers/svelte-language-server?worker&url';
	import TypescriptLanguageWorkerURL from '$lib/workers/typescript-language-server?worker&url';

	const lang_keys = [
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

	const lang_map: Record<SupportedLanguage, string> = {
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
	};

	export const supported_languages = lang_keys;
	export type SupportedLanguage = (typeof lang_keys)[number];
	export const is_supported_lang = (lang: string): lang is SupportedLanguage =>
		supported_languages.includes(lang as never);

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

	const create_language_servers = () => {
		const setup = () => {
			if (ts_transport && svelte_transport) return { svelte_transport, ts_transport };

			typescript_language_worker = new Worker(
				new URL(TypescriptLanguageWorkerURL, import.meta.url),
				{ type: 'module' },
			);
			svelte_language_worker = new Worker(new URL(SvelteLanguageWorkerURL, import.meta.url), {
				type: 'module',
			});

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

		return { setup, dispose };
	};

	let current_language_transport: Extension[] | undefined;
</script>

<script lang="ts">
	import { current_tab } from '$lib/tabs';
	import { deferred_promise } from '$lib/utils';
	import { webcontainer } from '$lib/webcontainer';
	import type { Extension } from '@codemirror/state';
	import { languageServerWithTransport } from 'codemirror-languageserver';
	import { onDestroy, onMount, setContext } from 'svelte';
	import { derived, writable } from 'svelte/store';

	// Swap out the current language client with the new one
	const update_extensions_with_client = (client: Extension[]) => {
		extensions.update(($extensions) => [
			...$extensions.filter((ext) => ext !== current_language_transport),
			client,
		]);
	};

	let svelte_transport: WorkerRPC;
	let ts_transport: WorkerRPC;
	let project_is_sveltekit = false;
	let setup_complete = writable(false);
	// Lets us know when the language client is ready and all initialization procedures have been completed
	const setup_completed = deferred_promise();
	$: if (resolved === true) {
		setup_complete.set(true);
	}
	$: console.log({ $setup_complete, resolved });
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

	// Store the current document uri formatted as `file:///path/to/file.ext`
	const document_uri = derived(current_tab, ($current_tab) => to_file_url($current_tab));

	let resolved = false;

	const get_current_lang = ($document_uri: string) => {
		const current_lang = $document_uri.split('.').at(-1) ?? '';
		const lang = is_supported_lang(current_lang) ? lang_map[current_lang] : undefined;
		return lang;
	};

	/** Sends the 'setup' RPC message to the language servers */
	const setup = async (
		project_type: 'fresh' | 'existing',
		configs_or_files: Record<string, string>,
	) => {
		if (project_type === 'fresh') {
			await svelte_transport.addFiles(configs_or_files);
			await ts_transport.addFiles(configs_or_files);

			await svelte_transport.setup(configs_or_files);
			await ts_transport.setup(configs_or_files);
		} else {
			await svelte_transport.addFiles(configs_or_files);
			await ts_transport.addFiles(configs_or_files);
			await svelte_transport.setup({});
			await ts_transport.setup({});
		}
		setup_completed.resolve(true);
		resolved = true;
	};

	const get_language_client = () => {
		let is_being_executed = false;

		const create_new_client = ($document_uri: string) => {
			const current_lang = $document_uri.split('.').at(-1) ?? '';
			const lang = get_current_lang($document_uri);

			if (!lang || (lang !== 'typescript' && lang !== 'javascript' && lang !== 'svelte')) {
				update_extensions_with_client([]);
				return;
			}
			const transport =
				lang === 'javascript' || lang === 'typescript' ? ts_transport : svelte_transport;
			console.log({ transport, lang, current_lang });

			// Create a new language client transport for the current tab if one doesn't exist
			const client = languageServerWithTransport({
				transport: transport as never,
				rootUri: 'file:///',
				workspaceFolders: [{ uri: 'file:///', name: 'root' }],
				documentUri: $document_uri,
				languageId:
					lang === 'javascript'
						? 'typescript'
						: lang === 'typescript'
						? 'typescript'
						: lang === 'svelte'
						? 'svelte'
						: '',
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

			// If the current language client is not the same as the one for the current tab, swap them out
			if (client && current_language_transport !== client) {
				update_extensions_with_client(client);

				current_language_transport = client;
			}
		};

		return ($document_uri: string) => {
			if (is_being_executed) return console.log('already being executed');
			is_being_executed = true;

			if (!resolved) {
				return;
			}

			if (lang_clients.has($document_uri)) {
				get_existing_client($document_uri);
			} else {
				create_new_client($document_uri);
			}
			is_being_executed = false;
		};
	};

	function setup_fresh_project() {
		if (resolved) return;
		const configs: Record<string, string> = {};

		let is_initialized = false;

		const has_svelte_kit_dotfiles = (files: Record<string, string>) => {
			const keys = Object.keys(files);

			return (
				keys.filter((key) => key.includes('.svelte-kit/types')).length >= 1 &&
				keys.some(
					(file) =>
						file.includes('.svelte-kit/') &&
						(file.includes('tsconfig.json') ||
							file.includes('ambient.d.ts') ||
							file.includes('types')),
				)
			);
		};

		const listen_for_type_changes = webcontainer.on_fs_change(
			'modification',
			throttle(async (path) => {
				if (path.includes('.svelte-kit/types')) {
					const file = await webcontainer.read_file(path, true);
					svelte_transport.addFiles({ [to_absolute_path(path)]: file });
				}
			}, 250),
		);

		const listen_for_configs = webcontainer.on_fs_change('creation', async (path) => {
			if (has_svelte_kit_dotfiles(configs) || !project_is_sveltekit) {
				if (!is_initialized) {
					is_initialized = true;

					configs[to_absolute_path(path)] = await webcontainer.read_file(path, true);
					if (!configs['/tsconfig.json'] || !configs['/jsconfig.json']) {
						configs['/tsconfig.json'] = `{
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
						"include": ["**/*.d.ts"]
						// Path aliases are handled by https://kit.svelte.dev/docs/configuration#alias
						//
						// If you want to overwrite includes/excludes, make sure to copy over the relevant includes/excludes
						// from the referenced tsconfig.json - TypeScript does not merge them in
					}`;
					}

					await setup('fresh', configs);
				} else {
					const temp = { [to_absolute_path(path)]: await webcontainer.read_file(path, true) };
					await svelte_transport.addFiles(temp);
				}
				return;
			}

			if (
				path === './tsconfig.json' ||
				path === './jsconfig.json' ||
				path === './svelte.config.js' ||
				path === './.svelte-kit/ambient.d.ts' ||
				path.startsWith('./.svelte-kit/')
			) {
				console.log(path, 'created', configs);
				await webcontainer.read_file(path, true).then((file) => {
					configs[to_absolute_path(path)] = file;
				});
			}
		});
		return { listen_for_configs, listen_for_type_changes };
	}

	let handle_config_changes: (() => void) | undefined;

	onMount(async () => {
		const worker_handlers = create_language_servers();

		const workers = worker_handlers.setup();

		({ svelte_transport, ts_transport } = workers);

		console.count('calls');
		handle_config_changes = webcontainer.on_init(async () => {
			const tree = await webcontainer.get_tree_from_container(true, false);
			const files = webcontainer.walk_tree_and_collect(tree);

			await webcontainer.read_package_json().then(async (json) => {
				await svelte_transport.addFiles(files);
				await ts_transport.addFiles(files);
				await svelte_transport.fetchTypes(json);
				await ts_transport.fetchTypes(json);

				if (typeof json === 'object' && 'devDependencies' in json) {
					if (json.devDependencies['@sveltejs/kit']) {
						project_is_sveltekit = true;
					}
				}
				if (Object.keys(files).some((file) => file.includes('.svelte-kit/'))) {
					await setup('existing', files);
				} else {
					setup_fresh_project();
				}
			});
		});
	});

	onDestroy(() => {
		if (typeof handle_config_changes === 'function') handle_config_changes();
	});

	setContext(LANGUAGE_CLIENT_CONTEXT, {
		extensions,
		document_uri,
		get_language_client: get_language_client(),
		setup_complete: setup_completed.promise,
	});
</script>

<slot />
