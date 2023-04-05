<script lang="ts">
	import { mobile_showing, showing_files } from '$lib/stores/mobile_showing_store';
	import IFrame from '~icons/material-symbols/browse-activity-outline-rounded';
	import Code from '~icons/material-symbols/code-rounded';
	import FileBrowser from '~icons/material-symbols/menu-rounded';
	import Terminal from '~icons/material-symbols/terminal-rounded';
</script>

<nav>
	<button
		title="Show File Browser"
		aria-pressed={$showing_files}
		on:click={() => ($showing_files = true)}
	>
		<FileBrowser />
	</button>

	<button
		title="Show Code"
		aria-pressed={$mobile_showing === 'code'}
		on:click={() => mobile_showing.show_code()}
	>
		<Code />
	</button>

	<button
		title="Show iFrame"
		aria-pressed={$mobile_showing === 'iframe'}
		on:click={() => mobile_showing.show_iframe()}
	>
		<IFrame />
	</button>

	<button
		title="Show Terminal"
		aria-pressed={$mobile_showing === 'terminal'}
		on:click={() => mobile_showing.show_terminal()}
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
