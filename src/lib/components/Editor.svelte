<script lang="ts">
	import { webcontainer } from '$lib/webcontainer';
	import { svelte } from '@replit/codemirror-lang-svelte';

	import CodeMirror from 'svelte-codemirror-editor';
</script>

<CodeMirror
	lang={svelte()}
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
