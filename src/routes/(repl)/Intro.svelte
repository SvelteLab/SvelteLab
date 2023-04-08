<script lang="ts">
	import { intro_hidden_forever, is_intro_open } from '$lib/stores/intro_store';
	import { marked } from 'marked';
	import Close from '~icons/material-symbols/close-rounded';
	import HideForever from '~icons/material-symbols/hide-source-outline-rounded';
	import README from '../../../README.md?raw';
	const intro = marked(README.split('---')[0]);
</script>

<aside>
	<button
		class="dismiss"
		title="Dismiss Intro"
		on:click={() => {
			$is_intro_open = false;
		}}
	>
		<Close />
	</button>
	<section>
		{@html intro}
	</section>

	<button
		class="hide-forever"
		on:click={() => {
			$intro_hidden_forever = true;
			$is_intro_open = false;
		}}
	>
		<HideForever /> Hide Intro forever
	</button>
</aside>

<style>
	.dismiss {
		padding: 1rem;
		position: fixed;
		right: 0;
	}

	.hide-forever {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin: auto;
		background-color: var(--sk-back-3);
		padding: 1rem 2rem;
		border-radius: 0.5rem;
		margin-bottom: 1rem;
	}

	button:hover {
		background-color: var(--sk-back-4);
	}

	button:active {
		background-color: var(--sk-back-5);
	}

	aside {
		background-color: var(--sk-back-1);
		max-height: 100%;
		overflow: auto;
	}
	section {
		padding: 0.5em 1em;
	}
	section :global(img) {
		max-width: 100%;
	}

	section :global(ul) {
		margin-inline-start: 2em;
	}
</style>
