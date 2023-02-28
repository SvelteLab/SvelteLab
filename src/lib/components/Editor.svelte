<script lang="ts">
	import { webcontainer } from '$lib/webcontainer';
	import { css } from '@codemirror/lang-css';
	import { html } from '@codemirror/lang-html';
	import { javascript } from '@codemirror/lang-javascript';
	import { json } from '@codemirror/lang-json';
	import { markdown } from '@codemirror/lang-markdown';
	import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
	import { tags } from '@lezer/highlight';
	import { svelte } from '@replit/codemirror-lang-svelte';
	import CodeMirror from 'svelte-codemirror-editor';

	const svelte_syntax_style = HighlightStyle.define([
		{ tag: tags.comment, color: 'var(--sk-code-comment)' },
		{ tag: tags.keyword, color: 'var(--sk-code-keyword)' },
		{ tag: tags.string, color: 'var(--sk-code-string)' },
		{ tag: tags.number, color: 'var(--sk-code-number)' },
		{ tag: tags.tagName, color: 'var(--sk-code-tags)' }
	]);

	const theme = syntaxHighlighting(svelte_syntax_style);

	const langs: Record<string, ReturnType<typeof svelte>> = {
		svelte: svelte(),
		html: html(),
		js: javascript(),
		ts: javascript({ typescript: true }),
		css: css(),
		json: json(),
		md: markdown()
	};

	$: lang = langs[$webcontainer.current_path.split('.').at(-1) || 'svelte'];
</script>

<CodeMirror
	{lang}
	{theme}
	useTab
	tabSize={3}
	value={$webcontainer.current_file}
	on:change={(e) => {
		webcontainer.update_file($webcontainer.current_path, e.detail);
	}}
	styles={{
		'&': {
			width: '100%',
			height: '100%',
			overflow: 'auto',
			'background-color': 'var(--sk-code-bg)',
			color: 'var(--sk-code-base)'
		},
		'*': {
			'font-family': 'var(--sk-font-mono)',
			'tab-size': 3
		},
		'.cm-gutters': {
			border: 'none'
		},
		'.cm-gutter': {
			'background-color': 'var(--sk-code-bg)',
			color: 'var(--sk-code-base)'
		},
		'.cm-line.cm-activeLine': {
			'background-color': 'var(--sk-back-translucent)'
		},
		'.cm-activeLineGutter': {
			'background-color': 'var(--sk-back-3)'
		},
		'.cm-focused.cm-selectionBackground': {
			'background-color': 'var(--sk-back-4) !important'
		},
		'.cm-selectionBackground': {
			'background-color': 'var(--sk-back-5) !important'
		},
		'.cm-cursor': {
			'border-color': 'var(--sk-code-base)'
		}
	}}
/>

<style>
	:global(.codemirror-wrapper) {
		width: 100%;
		height: 100%;
	}
</style>
