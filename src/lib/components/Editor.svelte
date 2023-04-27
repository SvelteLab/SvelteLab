<script lang="ts">
	import { on_command } from '$lib/command_runner/commands';
	import VoidEditor from '$lib/components/VoidEditor.svelte';
	import { editor_config } from '$lib/stores/editor_config_store';
	import { js_snippets, svelte_snippets } from '$lib/svelte-snippets';
	import { current_tab } from '$lib/tabs';
	import type { SvelteError } from '$lib/types';
	import { webcontainer } from '$lib/webcontainer';
	import { indentWithTab } from '@codemirror/commands';
	import { css } from '@codemirror/lang-css';
	import { html } from '@codemirror/lang-html';
	import { javascript } from '@codemirror/lang-javascript';
	import { json } from '@codemirror/lang-json';
	import { markdown } from '@codemirror/lang-markdown';
	import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
	import type { Diagnostic } from '@codemirror/lint';
	import { linter } from '@codemirror/lint';
	import { keymap } from '@codemirror/view';
	import { abbreviationTracker } from '@emmetio/codemirror6-plugin';
	import { tags } from '@lezer/highlight';
	import { svelte } from '@replit/codemirror-lang-svelte';
	import { vim } from '@replit/codemirror-vim';
	import { basicSetup } from 'codemirror';
	import CodeMirror from 'svelte-codemirror-editor';
	import type { Warning } from 'svelte/types/compiler/interfaces';
	import Errors from './Errors.svelte';
	import Tabs from './Tabs.svelte';
	import ImageFromBytes from './ImageFromBytes.svelte';

	const svelte_syntax_style = HighlightStyle.define([
		{ tag: tags.comment, color: 'var(--sk-code-comment)' },
		{ tag: tags.keyword, color: 'var(--sk-code-keyword)' },
		{ tag: tags.string, color: 'var(--sk-code-string)' },
		{ tag: tags.number, color: 'var(--sk-code-number)' },
		{ tag: tags.tagName, color: 'var(--sk-code-tags)' },
		{ tag: tags.className, color: 'var(--sk-code-component)' },
	]);

	const theme = syntaxHighlighting(svelte_syntax_style);

	const langs: Record<string, ReturnType<typeof svelte>> = {
		svelte: svelte(),
		html: html(),
		js: javascript(),
		cjs: javascript(),
		mjs: javascript(),
		ts: javascript({ typescript: true }),
		css: css(),
		json: json(),
		md: markdown(),
	};

	let code: string;
	let image_bytes: Uint8Array;

	function get_extensions(config: typeof $editor_config) {
		const extensions = [
			basicSetup,
			js_snippets,
			svelte_snippets,
			linter(return_diagnostics),
			abbreviationTracker(),
			keymap.of([indentWithTab]),
		];
		if (config.vim) {
			extensions.unshift(
				vim({
					status: true,
				})
			);
		}
		return extensions;
	}

	$: extensions = get_extensions($editor_config);

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
	$: is_image = ['png', 'bmp', 'jpg', 'jpeg', 'gif', 'webp'].includes(current_lang);
	$: lang = langs[current_lang];
	$: read_current_tab($current_tab, is_image);

	on_command('format-current', () => {
		read_current_tab($current_tab, is_image);
	});

	const warnings_and_errors = {
		warnings: [] as Warning[],
		error: null as SvelteError | null,
	};

	function return_diagnostics() {
		const diagnostcs: Diagnostic[] = [];
		for (let warning of warnings_and_errors.warnings) {
			if (!(warning.start as any)?.character || !(warning.end as any)?.character) continue;
			diagnostcs.push({
				from: (warning.start as any).character,
				to: (warning.end as any).character,
				severity: 'warning',
				message: warning.message,
			});
		}
		if (warnings_and_errors.error) {
			const { error } = warnings_and_errors;
			if (error.start?.character && error.end?.character) {
				diagnostcs.push({
					from: error.start.character,
					to: error.end.character,
					severity: 'error',
					message: error.message,
				});
			}
		}
		return diagnostcs;
	}
</script>

{#if !$current_tab}
	<VoidEditor />
{:else}
	<Tabs />
	{#if is_image}
		<ImageFromBytes {image_bytes} type={current_lang} />
	{:else}
		<CodeMirror
			{lang}
			{theme}
			basic={false}
			useTab={false}
			tabSize={3}
			value={code ?? ''}
			{extensions}
			on:change={(e) => {
				webcontainer.update_file($current_tab, e.detail);
				code = e.detail;
			}}
			styles={{
				'&': {
					width: '100%',
					height: '100%',
					overflow: 'auto',
					'background-color': 'var(--sk-back-1)',
					color: 'var(--sk-code-base)',
				},
				'*': {
					'font-family': 'var(--sk-font-mono)',
					'tab-size': 3,
					'font-size': 'var(--sk-editor-font-size)',
				},
				'.cm-gutters': {
					border: 'none',
				},
				'.cm-gutter': {
					'background-color': 'var(--sk-back-1)',
					color: 'var(--sk-code-base)',
				},
				'.cm-line.cm-activeLine': {
					'background-color': 'var(--sk-back-translucent)',
				},
				'.cm-activeLineGutter': {
					'background-color': 'var(--sk-back-3)',
				},
				'.cm-focused.cm-selectionBackground': {
					'background-color': 'var(--sk-back-4) !important',
				},
				'.cm-selectionBackground': {
					'background-color': 'var(--sk-back-5) !important',
				},
				'.cm-cursor': {
					'border-color': 'var(--sk-code-base)',
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
			}}
		/>
		{#if current_lang === 'svelte'}
			<Errors
				{code}
				bind:warnings={warnings_and_errors.warnings}
				bind:error={warnings_and_errors.error}
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
