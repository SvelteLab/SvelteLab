<script context="module" lang="ts">
	// https://gitlab.com/aedge/codemirror-web-workers-lsp-demo/-/blob/master/src/App.svelte
	import { Transport } from '@open-rpc/client-js/src/transports/Transport';

	import { getNotifications } from '@open-rpc/client-js/src/Request';
	import type { JSONRPCRequestData, IJSONRPCData } from '@open-rpc/client-js/src/Request';

	class PostMessageWorkerTransport extends Transport {
		public declare worker: undefined | null | Worker;
		public declare postMessageID: string;

		constructor(worker: Worker) {
			super();
			this.worker = worker;

			this.postMessageID = `post-message-transport-${Math.random()}`;
		}

		private messageHandler = (ev: MessageEvent) => {
			console.log('<-', ev.data);

			this.transportRequestManager.resolveResponse(JSON.stringify(ev.data));
		};

		public connect(): Promise<void> {
			return new Promise((resolve) => {
				if (this.worker) this.worker.addEventListener('message', this.messageHandler);
				resolve();
			});
		}

		public async sendData(data: JSONRPCRequestData): Promise<unknown> {
			console.log('->', data);
			const prom = this.transportRequestManager.addRequest(data, null);
			const notifications = getNotifications(data);
			if (this.worker) {
				this.worker.postMessage((data as IJSONRPCData).request);
				this.transportRequestManager.settlePendingRequest(notifications);
			}
			return prom;
		}

		public close(): void {
			if (this.worker) this.worker.terminate();
		}
	}
</script>

<script lang="ts">
	import { on_command } from '$lib/command_runner/commands';
	import VoidEditor from '$lib/components/VoidEditor.svelte';
	import { editor_config, editor_preferences } from '$lib/stores/editor_config_store';
	import { js_snippets, svelte_snippets } from '$lib/svelte-snippets';
	import { current_tab } from '$lib/tabs';
	import { get_character_from_pos } from '$lib/utils';
	import { webcontainer } from '$lib/webcontainer';
	import { HighlightStyle, LanguageSupport, syntaxHighlighting } from '@codemirror/language';
	import { EditorView } from '@codemirror/view';
	import { abbreviationTracker } from '@emmetio/codemirror6-plugin';
	import { tags } from '@lezer/highlight';
	import { codemirror, withCodemirrorInstance } from '@neocodemirror/svelte';
	import { svelte } from '@replit/codemirror-lang-svelte';
	import Errors from './Errors.svelte';
	import ImageFromBytes from './ImageFromBytes.svelte';
	import Tabs from './Tabs.svelte';
	import { onMount } from 'svelte';
	import SvelteWorker from '$lib/workers/svelte-language-server?worker';
	// import { createWorkerMessage } from '$lib/language_servers/svelte/messages';
	import { LanguageServerClient, languageServerWithTransport } from 'codemirror-languageserver';
	import type { Extension } from '@codemirror/state';

	let svelte_language_worker: Worker = new SvelteWorker();

	let transport: PostMessageWorkerTransport;

	let language_client: LanguageServerClient;

	const svelte_syntax_style = HighlightStyle.define([
		{ tag: tags.comment, color: 'var(--sk-code-comment)' },
		{ tag: tags.keyword, color: 'var(--sk-code-keyword)' },
		{ tag: tags.string, color: 'var(--sk-code-string)' },
		{ tag: tags.number, color: 'var(--sk-code-number)' },
		{ tag: tags.tagName, color: 'var(--sk-code-tags)' },
		{ tag: tags.className, color: 'var(--sk-code-component)' },
	]);

	const lang_clients = new Map<string, Extension[]>();

	const theme = syntaxHighlighting(svelte_syntax_style);

	const langs: Record<string, () => Promise<LanguageSupport>> = {
		svelte: async () => svelte(),
		svx: async () => svelte(),
		html: () => import('@codemirror/lang-html').then((lang) => lang.html()),
		js: () => import('@codemirror/lang-javascript').then((lang) => lang.javascript()),
		cjs: () => import('@codemirror/lang-javascript').then((lang) => lang.javascript()),
		mjs: () => import('@codemirror/lang-javascript').then((lang) => lang.javascript()),
		ts: () => import('@codemirror/lang-javascript').then((lang) => lang.javascript()),
		css: () => import('@codemirror/lang-css').then((lang) => lang.css()),
		json: () => import('@codemirror/lang-json').then((lang) => lang.json()),
		md: () => import('@codemirror/lang-markdown').then((lang) => lang.markdown()),
	};

	let code: string;
	let image_bytes: Uint8Array;

	let cursor: number | null = null;

	let vim: (options: { status?: boolean }) => Extension;

	let extensions: Extension[];

	async function get_extensions(config: typeof $editor_config) {
		const extensions = [js_snippets, svelte_snippets, abbreviationTracker()];
		if (config.vim) {
			if (!vim) {
				vim = await import('@replit/codemirror-vim').then((vim_import) => vim_import.vim);
			}
			extensions.unshift(
				vim({
					status: true,
				})
			);
		}
		if (config.code_wrap) {
			extensions.unshift(EditorView.lineWrapping);
		}
		return extensions;
	}

	let current_language_client: Extension[] | undefined;

	function get_language_client(uri: string) {
		if (!uri || !extensions || !language_client || !transport) return;

		if (lang_clients.has(uri)) {
			const client = lang_clients.get(uri);
			if (client && current_language_client !== client) {
				extensions = [...extensions.filter((ext) => ext !== current_language_client), client];
				current_language_client = client;
			}
		} else {
			const client = languageServerWithTransport({
				transport: transport as never,
				rootUri: '/',
				workspaceFolders: [{ name: 'root', uri: '/' }],
				documentUri: `${$current_tab.replace('./', '/')}`,
				languageId: lang || 'svelte',
				allowHTMLContent: true,
				client: language_client,
			});
			lang_clients.set(uri, client);
			extensions = [...extensions.filter((ext) => ext !== current_language_client), client];
			current_language_client = client;
		}
	}

	$: get_extensions($editor_config).then((resolved_extensions) => {
		extensions = [...resolved_extensions];
	});

	// Create individual language client extensions for each document
	// This also handles swapping out the current language client when switching tabs

	$: get_language_client($current_tab);

	function read_current_tab(current_tab: string, is_image: boolean) {
		if (!current_tab) return;
		if (is_image) {
			webcontainer.read_file(current_tab, false).then((file) => {
				image_bytes = file;
			});
			return;
		}
		webcontainer.read_file(current_tab).then((file) => {
			code = file;
		});
	}

	$: current_lang = $current_tab.split('.').at(-1) ?? 'svelte';
	$: lang = current_lang in langs ? current_lang : undefined;
	$: is_image = ['png', 'bmp', 'jpg', 'jpeg', 'gif', 'webp'].includes(current_lang);
	$: read_current_tab($current_tab, is_image);

	on_command('format-current', () => {
		read_current_tab($current_tab, is_image);
	});

	onMount(() => {
		const handle_webcontainer_init = webcontainer.on_init(async () => {
			await Promise.allSettled([
				webcontainer.read_file('./svelte.config.js', true),
				webcontainer.read_file('./tsconfig.json', true),
				webcontainer.read_file('./.svelte-kit/tsconfig.json', true),
			]).then(([svelte_config, ts_config, kit_config]) => {
				// Post the setup message containing the project's config files to the worker
				svelte_language_worker.postMessage({
					method: '@@setup',
					params: {
						...(svelte_config.status === 'fulfilled' && {
							'/svelte.config.js': svelte_config.value,
						}),
						...(ts_config.status === 'fulfilled' && { '/tsconfig.json': ts_config.value }),
						...(kit_config.status === 'fulfilled' && {
							'/.svelte-kit/tsconfig.json': kit_config.value,
						}),
					},
				});
				// Create the transport and language client after the worker is setup
				// otherwise the worker will not be able to respond to the client
				// TODO: investigate this
				transport = new PostMessageWorkerTransport(svelte_language_worker);
				language_client = new LanguageServerClient({
					transport: transport as never,
					rootUri: '/',
					documentUri: `/${$current_tab.replace('./', '')}`,
					languageId: lang || 'svelte',
					workspaceFolders: [{ name: 'root', uri: '/' }],
				});
			});
		});

		const handle_fs_change = webcontainer.on_fs_change('deletion', (path) => {
			$codemirror_instance.documents.delete(path);
		});
		return () => {
			handle_fs_change();
			handle_webcontainer_init();
		};
	});

	export const codemirror_instance = withCodemirrorInstance();
</script>

{#if !$current_tab}
	<VoidEditor />
{:else}
	<Tabs />
	{#if is_image}
		<ImageFromBytes {image_bytes} type={current_lang} />
	{:else}
		<div
			class="codemirror-wrapper"
			on:codemirror:textChange={({ detail: new_code }) => {
				// puruvj suggested using this event instead
				// of the object one
				webcontainer.update_file($current_tab, new_code);
				code = new_code;
			}}
			on:codemirror:documentChanged={({ detail: d }) => {
				console.log(d);
			}}
			use:codemirror={{
				lang,
				langMap: langs,
				theme,
				tabSize: 3,
				useTabs: true,
				value: code,
				documentId: `${$current_tab.replace('./', '/')}`,
				extensions: extensions,
				cursorPos: cursor,
				setup: 'basic',
				instanceStore: codemirror_instance,
				onChangeBehavior: {
					duration: $editor_preferences.delay_duration ?? 300,
					kind: $editor_preferences.delay_function ?? 'throttle',
				},
				// lint: return_d/iagnostics,
				styles: {
					'&': {
						width: '100%',
						height: '100%',
						overflow: 'auto',
						backgroundColor: 'var(--sk-back-1)',
						color: 'var(--sk-code-base)',
					},
					'*': {
						fontFamily: 'var(--sk-font-mono)',
						tabSize: 3,
						fontSize: 'var(--sk-editor-font-size)',
					},
					'.cm-gutters': {
						border: 'none',
					},
					'.cm-gutter': {
						backgroundColor: 'var(--sk-back-1)',
						color: 'var(--sk-code-base)',
					},
					'.cm-line.cm-activeLine': {
						backgroundColor: 'var(--sk-back-translucent)',
					},
					'.cm-activeLineGutter': {
						backgroundColor: 'var(--sk-back-3)',
					},
					'.cm-focused.cm-selectionBackground': {
						backgroundColor: 'var(--sk-back-4) !important',
					},
					'.cm-selectionBackground': {
						backgroundColor: 'var(--sk-back-5) !important',
					},
					'.cm-cursor': {
						borderColor: 'var(--sk-code-base)',
					},
					'.cm-tooltip': {
						border: 'none',
						background: 'var(--sk-back-3)',
					},
					'.cm-tooltip.cm-tooltip-autocomplete > ul': {
						background: 'var(--sk-back-3)',
					},
					'.cm-tooltip-autocomplete ul li[aria-selected]': {
						background: 'var(--sk-theme-1)',
						color: 'var(--sk-text-1)',
					},
					'.cm-tooltip-lint': {
						background: 'var(--sk-back-3)',
						color: 'var(--sk-text-1)',
					},
					'.cm-panels': {
						background: 'var(--sk-back-3)',
						color: 'var(--sk-text-1)',
					},
				},
			}}
		/>
		{#if current_lang === 'svelte'}
			<Errors
				on:click_on_diagnostic={({ detail: diagnostic }) => {
					const new_pos = get_character_from_pos(
						diagnostic.end.line,
						diagnostic.end.character,
						code
					);

					$codemirror_instance.view?.focus();
					cursor = new_pos;
				}}
			/>
		{/if}
	{/if}
{/if}

<style>
	:global(.codemirror-wrapper) {
		grid-row: 2;
		overflow: auto;
	}
</style>
