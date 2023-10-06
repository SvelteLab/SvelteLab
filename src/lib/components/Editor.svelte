<script context="module" lang="ts">
	/**
	 * Debounces a function but cancels previous invocation only if
	 * a second function determines it should.
	 *
	 * @param fn The function with it's argument
	 * @param determineIfSame The function which determines if the previous invocation should be canceld or not
	 * @param miliseconds Number of miliseconds to debounce
	 */
	export function debounce_same_arg<T>(
		fn: (arg: T) => void,
		should_cancel_previous: (newArg: T, prevArg?: T) => boolean,
		miliseconds: number,
	): (arg: T) => void {
		let timeout: ReturnType<typeof setTimeout>;
		let prev_arg: T | undefined;

		return async (arg: T) => {
			if (should_cancel_previous(arg, prev_arg)) {
				clearTimeout(timeout);
			}

			prev_arg = arg;
			timeout = setTimeout(() => {
				fn(arg);
				prev_arg = undefined;
			}, miliseconds);
		};
	}
</script>

<script lang="ts">
	import { on_command } from '$lib/command_runner/commands';
	import VoidEditor from '$lib/components/VoidEditor.svelte';
	import { editor_config, editor_preferences } from '$lib/stores/editor_config_store';
	import { svelte_snippets } from '$lib/svelte-snippets';
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
	import { getContext, onMount, tick } from 'svelte';
	import type { Extension } from '@codemirror/state';
	import {
		get_current_file_ext,
		is_lsp_file_type,
		type LanguageClientContext,
		type SupportedFileExtension,
	} from './LanguageClientProvider.svelte';

	const {
		extensions,
		get_language_client,
		document_uri,
		setup_complete,
		update_file: update_lsp_file,
	}: LanguageClientContext = getContext(Symbol.for('svelte_language_worker'));

	const svelte_syntax_style = HighlightStyle.define([
		{ tag: tags.comment, color: 'var(--sk-code-comment)' },
		{ tag: tags.keyword, color: 'var(--sk-code-keyword)' },
		{ tag: tags.string, color: 'var(--sk-code-string)' },
		{ tag: tags.number, color: 'var(--sk-code-number)' },
		{ tag: tags.tagName, color: 'var(--sk-code-tags)' },
		{ tag: tags.className, color: 'var(--sk-code-component)' },
	]);

	const theme = syntaxHighlighting(svelte_syntax_style);

	const langs: Record<SupportedFileExtension, () => Promise<LanguageSupport>> = {
		svelte: async () => svelte(),
		svx: async () => svelte(),
		html: () => import('@codemirror/lang-html').then((lang) => lang.html()),
		js: () => import('@codemirror/lang-javascript').then((lang) => lang.javascript()),
		cjs: () => import('@codemirror/lang-javascript').then((lang) => lang.javascript()),
		mjs: () => import('@codemirror/lang-javascript').then((lang) => lang.javascript()),
		ts: () =>
			import('@codemirror/lang-javascript').then((lang) => lang.javascript({ typescript: true })),
		css: () => import('@codemirror/lang-css').then((lang) => lang.css()),
		postcss: () => import('@codemirror/lang-css').then((lang) => lang.css()),
		json: () => import('@codemirror/lang-json').then((lang) => lang.json()),
		md: () => import('@codemirror/lang-markdown').then((lang) => lang.markdown()),
	};

	let code: string;
	let image_bytes: Uint8Array;

	let cursor: number | null = null;

	let vim: (options: { status?: boolean }) => Extension;

	const debounced_file_update = debounce_same_arg(
		({ document_uri, new_code }: { document_uri: string; new_code: string }) => {
			update_lsp_file(document_uri, new_code);
		},
		({ document_uri, new_code }, old_args) => {
			if (!old_args) return false;
			const { document_uri: old_uri, new_code: old_code } = old_args;
			return document_uri === old_uri && new_code === old_code;
		},
		32,
	);

	const update_code = (new_code: string) => {
		code = new_code;
	};

	async function get_extensions(config: typeof $editor_config) {
		const extensions = [svelte_snippets, abbreviationTracker()];
		if (config.vim) {
			if (!vim) {
				vim = await import('@replit/codemirror-vim').then((vim_import) => vim_import.vim);
			}
			extensions.unshift(
				vim({
					status: true,
				}),
			);
		}
		if (config.code_wrap) {
			extensions.unshift(EditorView.lineWrapping);
		}
		return extensions;
	}

	$: get_extensions($editor_config).then((resolved_extensions) => {
		extensions.update(($extensions) => [...$extensions, ...resolved_extensions]);
	});

	async function read_current_tab(tab: string, is_image: boolean) {
		if (!tab || tab === 'file:///') return;
		if (is_image) {
			image_bytes = await webcontainer.read_file(`.${new URL(tab).pathname}`, false);
		}

		const code = await webcontainer.read_file(`.${new URL(tab).pathname}`);
		update_code(code);
	}

	async function open_editor_document(uri: string) {
		if (!uri || uri === 'file:///') return;
		await get_language_client(uri);
	}

	$: current_lang = get_current_file_ext($current_tab) ?? 'svelte';
	$: lang = current_lang in langs ? current_lang : undefined;
	$: is_image = ['png', 'bmp', 'jpg', 'jpeg', 'gif', 'webp'].includes(current_lang);

	on_command('format-current', () => {
		read_current_tab($current_tab, is_image);
	});

	onMount(() => {
		let current_tab_unsub: () => void;
		let handle_fs_change: () => void;

		setup_complete.then(() => open_editor_document($document_uri));
		current_tab_unsub = document_uri.subscribe(async () => {
			await tick();
			await read_current_tab($document_uri, is_image);
			await open_editor_document($document_uri);
		});

		handle_fs_change = webcontainer.on_fs_change('deletion', (path) => {
			$codemirror_instance.documents.delete(path);
		});
		return () => {
			if (current_tab_unsub) {
				current_tab_unsub();
			}
			if (handle_fs_change) {
				handle_fs_change();
			}
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
				if (new_code === code || new_code === null) return;
				// puruvj suggested using this event instead
				// of the object one
				webcontainer.update_file($current_tab, new_code);
				update_code(new_code);
				if (!is_lsp_file_type($document_uri)) {
					debounced_file_update({ document_uri: $document_uri, new_code });
				}
			}}
			use:codemirror={{
				lang,
				langMap: langs,
				theme,
				tabSize: 3,
				useTabs: true,
				value: code,
				documentId: $document_uri,
				extensions: $extensions,
				cursorPos: cursor,
				setup: 'basic',
				instanceStore: codemirror_instance,
				onChangeBehavior: {
					duration: $editor_preferences.delay_duration ?? 300,
					kind: $editor_preferences.delay_function ?? 'throttle',
				},
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
						code,
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
