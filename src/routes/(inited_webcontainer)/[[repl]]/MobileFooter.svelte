<script lang="ts">
	import Code from '~icons/akar-icons/chevron-horizontal';
	import Terminal from '~icons/akar-icons/credit-card-alt1';
	import IFrame from '~icons/akar-icons/globe';
	import FileBrowser from '~icons/akar-icons/three-line-horizontal';

	export let showing: 'files' | 'code' | 'iframe' | 'terminal' = 'code';
</script>

<nav>
	<button
		title="Show File Browser"
		aria-pressed={showing === 'files'}
		on:click={() => (showing = 'files')}
	>
		<FileBrowser />
	</button>

	<button title="Show Code" aria-pressed={showing === 'code'} on:click={() => (showing = 'code')}>
		<Code />
	</button>

	<button
		title="Show iFrame"
		aria-pressed={showing === 'iframe'}
		on:click={() => (showing = 'iframe')}
	>
		<IFrame />
	</button>

	<button
		title="Show Terminal"
		aria-pressed={showing === 'terminal'}
		on:click={() => (showing = 'terminal')}
	>
		<Terminal />
	</button>
</nav>

<style>
	nav {
		display: flex;
		background-color: var(--sk-back-1);
	}
	button {
		padding: 1rem;
		font-size: 1.5em;
		position: relative;
		flex-grow: 1;
	}

	button :global(svg) {
		margin: auto;
	}

	button[aria-pressed='true']::after {
		content: '';
		position: absolute;
		background-color: var(--sk-theme-1);
		right: 1px;
		left: 1px;
		bottom: 0;
		top: calc(100% - 3px);
	}
</style>
