<script lang="ts">
	import { on_command } from '$lib/command_runner/commands';
	import VoidEditor from '$lib/components/VoidEditor.svelte';
	import { editor_config, editor_preferences } from '$lib/stores/editor_config_store';
	import { diagnostic_store } from '$lib/stores/editor_errors_store';
	import { js_snippets, svelte_snippets } from '$lib/svelte-snippets';
	import { current_tab } from '$lib/tabs';
	import { get_character_from_pos } from '$lib/utils';
	import { webcontainer } from '$lib/webcontainer';
	import { javascript } from '@codemirror/lang-javascript';
	import { HighlightStyle, LanguageSupport, syntaxHighlighting } from '@codemirror/language';
	import type { Diagnostic } from '@codemirror/lint';
	import { linter } from '@codemirror/lint';
	import type { Extension } from '@codemirror/state';
	import { EditorView } from '@codemirror/view';
	import { abbreviationTracker } from '@emmetio/codemirror6-plugin';
	import { tags } from '@lezer/highlight';
	import { codemirror, withCodemirrorInstance } from '@neocodemirror/svelte';
	import Errors from './Errors.svelte';
	import ImageFromBytes from './ImageFromBytes.svelte';
	import Tabs from './Tabs.svelte';
	import { svelte } from '@replit/codemirror-lang-svelte';
	import editor_preferences from '$lib/editor_preferences';

	const svelte_syntax_style = HighlightStyle.define([
		{ tag: tags.comment, color: 'var(--sk-code-comment)' },
		{ tag: tags.keyword, color: 'var(--sk-code-keyword)' },
		{ tag: tags.string, color: 'var(--sk-code-string)' },
		{ tag: tags.number, color: 'var(--sk-code-number)' },
		{ tag: tags.tagName, color: 'var(--sk-code-tags)' },
		{ tag: tags.className, color: 'var(--sk-code-component)' },
	]);

	const theme = syntaxHighlighting(svelte_syntax_style);

	const langs: Record<string, () => Promise<LanguageSupport>> = {
		svelte: async () => svelte(),
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

	let vim: (options: { status?: boolean }) => Extension;

	$: console.log($editor_preferences);

	async function get_extensions(config: typeof $editor_config) {
		const extensions = [
			js_snippets,
			svelte_snippets,
			linter(return_diagnostics),
			abbreviationTracker(),
		];
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
	let extensions: Extension[];
	$: get_extensions($editor_config).then((resolved_extensions) => {
		extensions = resolved_extensions;
	});

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

	async function return_diagnostics() {
		const diagnostics: Diagnostic[] = [];
		const svelte_diagnostics = (await diagnostic_store.get_diagnostic($current_tab)) ?? [];
		for (let diagnostic of svelte_diagnostics) {
			diagnostics.push({
				from: get_character_from_pos(diagnostic.start.line, diagnostic.start.character, code),
				to: get_character_from_pos(diagnostic.end.line, diagnostic.end.character, code),
				message: diagnostic.message,
				severity: diagnostic.type,
				source: diagnostic.source,
			});
		}
		return diagnostics;
	}
	const codemirror_instance = withCodemirrorInstance();
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
			use:codemirror={{
				lang,
				langMap: langs,
				theme,
				tabSize: 3,
				useTabs: true,
				value: code,
				extensions,
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
						code
					);
					$codemirror_instance.view?.focus();
					$codemirror_instance.view?.dispatch({
						selection: {
							anchor: new_pos,
							head: new_pos,
						},
					});
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
