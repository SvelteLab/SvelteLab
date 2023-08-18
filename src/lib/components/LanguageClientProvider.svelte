<script context="module" lang="ts">
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

	const LANGUAGE_CLIENT_CONTEXT = Symbol.for('svelte_language_worker');

	const extensions = writable<Extension[]>([]);
	const lang_clients = new Map<string, Extension[]>();

	let svelte_language_worker: Worker = new SvelteLanguageWorker();
	const svelte_transport = new SvelteWorkerRPC(svelte_language_worker, {
		rootUri: 'file:///',
		workspaceFolders: null,
		documentUri: '',
		languageId: '',
		allowHTMLContent: true,
	});

	let language_client: LanguageServerClient | null = null;
	let current_language_transport: Extension[] | undefined;
</script>

<script lang="ts">
	import { SvelteWorkerRPC } from '$lib/lsp/svelte/index.js';
	import { current_tab } from '$lib/tabs';
	import { deferred_promise } from '$lib/utils';
	import { webcontainer } from '$lib/webcontainer';
	import SvelteLanguageWorker from '$lib/workers/svelte-language-server?worker';
	import type { Extension } from '@codemirror/state';
	import { LanguageServerClient, languageServerWithTransport } from 'codemirror-languageserver';
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

	// Lets us know when the language client is ready and all initialization procedures have been completed
	const setup_completed = deferred_promise();

	// Store the current document uri formatted as `file:///path/to/file.ext`
	const document_uri = derived(
		current_tab,
		($current_tab) => `${$current_tab.replace('./', 'file:///')}`,
	);
	let resolved = false;

	function get_language_client() {
		let is_being_executed = false;
		return () => {
			if (is_being_executed) return;
			is_being_executed = true;

			if (!resolved) {
				is_being_executed = false;
				return;
			}
			if (lang_clients.has($document_uri)) {
				const client = lang_clients.get($document_uri);

				// If the current language client is not the same as the one for the current tab, swap them out
				if (client && current_language_transport !== client) {
					update_extensions_with_client(client);

					current_language_transport = client;
				}
			} else {
				const current_lang = $document_uri.split('.').at(-1) ?? 'svelte';
				const lang = is_supported_lang(current_lang) ? lang_map[current_lang] : undefined;

				// Create a new language client transport for the current tab if one doesn't exist
				const client = languageServerWithTransport({
					transport: svelte_transport as never,
					rootUri: 'file:///',
					workspaceFolders: null,
					documentUri: $document_uri,
					languageId: lang ?? '',
					allowHTMLContent: true,
					client: svelte_transport.client() as never,
					autoClose: false,
				});

				// Add the new language client to the language client map
				lang_clients.set($document_uri, client);

				update_extensions_with_client(client);

				current_language_transport = client;
			}
			is_being_executed = false;
		};
	}

	function initialize_connection() {
		if (language_client) return;
		const configs: Record<string, string> = {};

		let is_initialized = false;

		const listen_for_configs = webcontainer.on_fs_change('creation', async (path) => {
			if (path === './.svelte-kit/tsconfig.json') {
				await webcontainer.read_file(path, true).then(async (file) => {
					if (!is_initialized) {
						if (!is_initialized) is_initialized = true;

						configs[path.startsWith('./') ? path.replace('./', '/') : path] = file;

						await svelte_transport.setup(configs);

						setup_completed.resolve(true);
						resolved = true;
					} else {
						const temp = { [path.startsWith('./') ? path.replace('./', '/') : path]: file };
						await svelte_transport.addFiles(temp);
					}
					return;
				});
			} else if (
				path === './tsconfig.json' ||
				path === './jsconfig.json' ||
				path === './svelte.config.js' ||
				path === './.svelte-kit/ambient.d.ts'
			) {
				await webcontainer.read_file(path, true).then((file) => {
					configs[path.startsWith('./') ? path.replace('./', '/') : path] = file;
				});
			} else {
				// await webcontainer.read_file(path, true).then((file) => {return svelte_transport.addFiles({[path.startsWith('./') ? path.replace('./', '/') : path]: file})});
			}
		});
		return listen_for_configs;
	}

	onMount(() => {

		const handle_config_changes = webcontainer.on_init(async () => {
			const tree = await webcontainer.get_tree_from_container(true);
			const files = webcontainer.walk_tree_and_collect(tree);
			await svelte_transport.addFiles(files);

			await webcontainer.read_package_json().then(async (json) => {
				await svelte_transport.fetchTypes(json);
				initialize_connection();
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

<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
{#await setup_completed.promise}
	<VoidEditor />
{:then}
	<slot />
{/await}
