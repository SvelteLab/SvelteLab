<script lang="ts">
	import { toast } from '@zerodevx/svelte-toast';
	import { get_theme } from '$lib/theme';
	import { webcontainer } from '$lib/webcontainer';
	import Save from '~icons/akar-icons/cloud';
	import Fork from '~icons/akar-icons/copy';
	import Login from '~icons/akar-icons/face-happy';
	import Moon from '~icons/akar-icons/moon';
	import Pending from '~icons/akar-icons/more-horizontal';
	import Share from '~icons/akar-icons/network';
	import PanelBottom from '~icons/akar-icons/panel-bottom';
	import PanelLeft from '~icons/akar-icons/panel-left';
	import Planet from '~icons/akar-icons/planet';
	import ConfigFiles from '~icons/akar-icons/settings-horizontal';
	import Sun from '~icons/akar-icons/sun';
	import { layout_store } from './layout_store';
	const theme = get_theme();
	let saving = new Promise((resolve) => resolve(null));
</script>

<header>
	<img src="./logo.svg" alt="svelteblitz logo" />
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
			<Planet />
		{/if}
	</button>

	<span> Hello World </span>

	<button title="Fork Project">
		<Fork />
	</button>

	<button
		on:click={async () => {
			try {
				const share_url = await webcontainer.get_share_url();
				window.navigator.clipboard.writeText(share_url.toString());
				toast.push('Copied to clipboard');
			} catch (e) {
				toast.push('Errors were made', {
					theme: {
						'--toastBarBackground': '#ff0000'
					}
				});
			}
		}}
		title="Share"
	>
		<Share />
	</button>
	<button
		title="Save Changes"
		on:click={async () => {
			// we can do this instead of goto: we don't need svelte to reload the
			// components, we just need to provide the user with the new url
			// and let him refresh if it wants. This obviosuly would be an api
			// call to get the correct id from the db
			history.pushState(null, '', '/' + Math.random().toString(36).substring(2));
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
	img {
		width: 32px;
		aspect-ratio: 1;
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
