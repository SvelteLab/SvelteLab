<script context="module" lang="ts">
	import { WorkerRPC } from '$lib/lsp/svelte/index.js';
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
				workspaceFolders: null,
				documentUri: '',
				languageId: '',
				allowHTMLContent: true,
			} as never);
			ts_transport = new WorkerRPC(typescript_language_worker, {
				rootUri: 'file:///',
				workspaceFolders: null,
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
	import { onMount, setContext } from 'svelte';
	import { derived, writable } from 'svelte/store';
	import VoidEditor from './VoidEditor.svelte';

	// Swap out the current language client with the new one
	const update_extensions_with_client = (client: Extension[]) => {
		extensions.update(($extensions) => [
			...$extensions.filter((ext) => ext !== current_language_transport),
			client,
		]);
	};

	let svelte_transport: WorkerRPC;
	let ts_transport: WorkerRPC;

	// Lets us know when the language client is ready and all initialization procedures have been completed
	const setup_completed = deferred_promise();

	// Store the current document uri formatted as `file:///path/to/file.ext`
	const document_uri = derived(
		current_tab,
		($current_tab) => `${$current_tab.replace('./', 'file:///')}`,
	);

	let resolved = false;

	const setup = async (
		project_type: 'fresh' | 'existing',
		configs_or_files: Record<string, string>,
	) => {
		if (project_type === 'fresh') {
			await svelte_transport.setup(configs_or_files);
			await ts_transport.setup(configs_or_files);
		} else {
			await svelte_transport.setup(configs_or_files);
			await ts_transport.setup(configs_or_files);
			// await svelte_transport.setup({});
			// await ts_transport.setup({});
		}
		setup_completed.resolve(true);
		resolved = true;
	};

	const get_language_client = () => {
		let is_being_executed = false;

		const create_new_client = () => {
			const current_lang = $document_uri.split('.').at(-1) ?? '';
			const lang = is_supported_lang(current_lang) ? lang_map[current_lang] : undefined;
			if (!lang || (lang !== 'typescript' &&lang !== 'javascript ' && lang !== 'svelte')) return;
			const transport =
				current_lang === 'ts' || current_lang === 'js' ? ts_transport : svelte_transport;

			// Create a new language client transport for the current tab if one doesn't exist
			const client = languageServerWithTransport({
				transport: transport as never,
				rootUri: 'file:///',
				workspaceFolders: [{ uri: 'file:///', name: '' }],
				documentUri: $document_uri,
				languageId: lang ?? '',
				allowHTMLContent: true,
				client: transport.client(),
				autoClose: false,
			});

			// Add the new language client to the language client map
			lang_clients.set($document_uri, client);

			update_extensions_with_client(client);

			current_language_transport = client;
		};

		const get_existing_client = () => {
			const client = lang_clients.get($document_uri);

			// If the current language client is not the same as the one for the current tab, swap them out
			if (client && current_language_transport !== client) {
				update_extensions_with_client(client);

				current_language_transport = client;
			}
		};

		return () => {
			try {
				if (is_being_executed) return;
				is_being_executed = true;

				if (!resolved) {
					is_being_executed = false;
					return;
				}

				if (lang_clients.has($document_uri)) {
					get_existing_client();
				} else {
					create_new_client();
				}
			} finally {
				is_being_executed = false;
			}
		};
	};

	function setup_fresh_project() {
		if (resolved) return;
		const configs: Record<string, string> = {};

		let is_initialized = false;

		const listen_for_configs = webcontainer.on_fs_change('creation', async (path) => {
			if (path === './.svelte-kit/tsconfig.json') {
				await webcontainer.read_file(path, true).then(async (file) => {
					if (!is_initialized) {
						if (!is_initialized) is_initialized = true;

						configs[to_absolute_path(path)] = file;

						await setup('fresh', configs);
					} else {
						const temp = { [to_absolute_path(path)]: file };
						await svelte_transport.addFiles(temp);
					}
					return;
				});
			} else if (
				path === './tsconfig.json' ||
				path === './jsconfig.json' ||
				path === './svelte.config.js' ||
				path === './.svelte-kit/ambient.d.ts' ||
				path.startsWith('./.svelte-kit/types/')
			) {
				await webcontainer.read_file(path, true).then((file) => {
					configs[to_absolute_path(path)] = file;
				});
			}
		});
		return listen_for_configs;
	}

	onMount(() => {
		const worker_handlers = create_language_servers();

		const workers = worker_handlers.setup();

		({ svelte_transport, ts_transport } = workers);

		console.count('calls');
		const handle_config_changes = webcontainer.on_init(async () => {
			const tree = await webcontainer.get_tree_from_container(true);
			const files = webcontainer.walk_tree_and_collect(tree);

			await svelte_transport.addFiles(files);

			await webcontainer.read_package_json().then(async (json) => {
				await svelte_transport.fetchTypes(json);
				await ts_transport.fetchTypes(json);
				if (Object.keys(files).some((file) => file.includes('.svelte-kit/'))) {
					await setup('existing', files);
				} else {
					await ts_transport.addFiles(files);
					await setup_fresh_project();
				}
			});
		});

		return () => {
			handle_config_changes();
		};
	});

	setContext(LANGUAGE_CLIENT_CONTEXT, {
		extensions,
		document_uri,
		get_language_client: get_language_client(),
	});
</script>

{#if !resolved}
	<VoidEditor />
{:else}
	<slot />
{/if}
