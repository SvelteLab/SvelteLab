<script lang="ts">
	import { webcontainer } from '$lib/webcontainer';
	import Save from '~icons/akar-icons/cloud';
	import Fork from '~icons/akar-icons/copy';
	import Login from '~icons/akar-icons/face-happy';
	import Sun from '~icons/akar-icons/sun';
	import Moon from '~icons/akar-icons/moon';
	import Pending from '~icons/akar-icons/more-horizontal';
	import PanelBottom from '~icons/akar-icons/panel-bottom';
	import PanelLeft from '~icons/akar-icons/panel-left';
	import ConfigFiles from '~icons/akar-icons/settings-horizontal';
	import { layout_store } from './layout_store';
	import { theme } from '$lib/theme';
	import { onMount } from 'svelte';
	let theme_icon_if_null = Moon;
	onMount(() => {
		const match = window.matchMedia('(prefers-color-scheme: dark)');
		if (match.matches) {
			theme_icon_if_null = Sun;
		}
		const listener = (event: MediaQueryListEvent) => {
			theme_icon_if_null = event.matches ? Sun : Moon;
		};
		match.addEventListener('change', listener);
		return () => {
			match.removeEventListener('change', listener);
		};
	});
	let saving = new Promise((resolve) => resolve(null));
</script>

<header>
	<button
		title="Toggle File Browser"
		on:click={layout_store.toggle_file_tree}
		class:active={$layout_store.file_tree}
		aria-pressed={$layout_store.file_tree}
	>
		<PanelLeft />
	</button>

	<button
		title="Toggle Terminal"
		on:click={layout_store.toggle_terminal}
		class:active={$layout_store.terminal}
		aria-pressed={$layout_store.terminal}
	>
		<PanelBottom />
	</button>

	<button title="Toggle Config Files">
		<ConfigFiles />
	</button>

	<button
		on:click={() => {
			theme.next();
		}}
		title="Change theme"
	>
		{#if $theme === 'light'}
			<Moon />
		{:else if $theme === 'dark'}
			<Sun />
		{:else}
			<svelte:component this={theme_icon_if_null} />
		{/if}
	</button>

	<span> Hello World </span>

	<button title="Fork Project">
		<Fork />
	</button>

	<button
		title="Save Changes"
		on:click={async () => {
			saving = webcontainer.save();
		}}
	>
		{#await saving}
			<Pending />
		{:then _}
			<Save />
		{/await}
	</button>

	<button title="Login">
		<Login />
	</button>
</header>

<style>
	header {
		padding: 0.75em 1.5em;
		display: flex;
		gap: 1em;
		background-color: var(--sk-back-2);
		position: relative;
		z-index: 2;
		align-items: center;
		box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.2);
	}

	button {
		font-size: 1.25em;
		display: grid;
		place-items: center;
		position: relative;
		padding-block: 0.25rem;
	}

	button.active::after {
		content: '';
		position: absolute;
		background-color: var(--sk-theme-1);
		right: 1px;
		left: 1px;
		bottom: 0;
		top: calc(100% - 3px);
	}

	span {
		margin-left: 2em;
		flex-grow: 1;
	}
</style>
