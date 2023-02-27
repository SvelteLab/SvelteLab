<script lang="ts">
	import { webcontainer } from '$lib/webcontainer';
	import { css } from '@codemirror/lang-css';
	import { html } from '@codemirror/lang-html';
	import { javascript } from '@codemirror/lang-javascript';
	import { json } from '@codemirror/lang-json';
	import { markdown } from '@codemirror/lang-markdown';
	import { svelte } from '@replit/codemirror-lang-svelte';
	import CodeMirror from 'svelte-codemirror-editor';

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
	value={$webcontainer.current_file}
	on:change={(e) => {
		webcontainer.update_file($webcontainer.current_path, e.detail);
	}}
	styles={{
		'&': {
			width: '100%',
			height: '100%',
			overflow: 'auto'
		},
		'*': {
			'font-family': 'var(--sk-font-mono)'
		}
	}}
/>

<style>
	:global(.codemirror-wrapper) {
		width: 100%;
		height: 100%;
	}

	textarea {
		width: 100%;
		height: 100%;
		background-color: var(--sk-back-1);
		color: var(--sk-code-base);
		border: none;
		resize: none;
		padding: 0.75em;
	}
</style>
