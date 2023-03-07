<script lang="ts">
	import { enhance } from '$app/forms';
	import { theme } from '$lib/theme';
	import { webcontainer } from '$lib/webcontainer';
	import Save from '$lib/components/icons/Save.svelte';
	import Fork from '$lib/components/icons/Fork.svelte';
	import SignIn from '~icons/akar-icons/person';
	import SignOut from '~icons/akar-icons/sign-out';
	import Moon from '~icons/akar-icons/moon';
	import Pending from '~icons/eos-icons/loading';
	import Share from '~icons/akar-icons/network';
	import PanelBottom from '~icons/akar-icons/panel-bottom';
	import PanelLeft from '~icons/akar-icons/panel-left';
	import Planet from '~icons/akar-icons/planet';
	import ConfigFiles from '~icons/akar-icons/settings-horizontal';
	import Sun from '~icons/akar-icons/sun';
	import { layout_store } from '$lib/stores/layout_store';
	import { page } from '$app/stores';
	import { PUBLIC_GITHUB_REDIRECT_URI } from '$env/static/public';
	import { invalidate } from '$app/navigation';
	import Avatar from '$lib/components/Avatar.svelte';
	import { success, error } from '$lib/toast';
	import { save_repl } from '$lib/api/client/repls';
	import { repl_name, is_repl_saving } from '$lib/stores/repl_id_store';

	$: ({ user, github_login } = $page.data ?? {});
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
		on:click={(e) => {
			if (e.shiftKey) {
				theme.remove_preference();
			} else {
				theme.change_preference();
			}
		}}
		title="Change theme. Shift+Click to delete preference"
	>
		{#if $theme.next === 'light'}
			<Sun />
		{:else if $theme.next === 'dark'}
			<Moon />
		{:else}
			<Planet />
		{/if}
	</button>

	<input bind:value={$repl_name} />

	<button
		on:click={async () => {
			try {
				const share_url = await webcontainer.get_share_url();
				window.navigator.clipboard.writeText(share_url.toString());
				success('Copied to clipboard');
			} catch (e) {
				error("Can't copy to clipboard");
			}
		}}
		title="Share"
	>
		<Share />
	</button>

	{#if user}
		<button title="Fork Project">
			<Fork />
		</button>
		<button
			on:click={async () => {
				await save_repl();
			}}
			title="Save Changes"
		>
			{#if $is_repl_saving}
				<Pending />
			{:else}
				<Save />
			{/if}
		</button>

		<a href="/profile" class="btn" title="Profile">
			<Avatar alt={`${user.name} profile`} src={`./proxy/?url=${user.avatarUrl}`} />
		</a>
		<form
			use:enhance={() => () => {
				//on logout we invalidate authed:user which reload the page
				invalidate('authed:user');
			}}
			method="POST"
			action="?/logout"
		>
			<button title="Sign out">
				<SignOut />
			</button>
		</form>
	{:else}
		<a
			class="btn"
			href={`${github_login?.authUrl}${PUBLIC_GITHUB_REDIRECT_URI}`}
			title="Login with GitHub"
		>
			<SignIn />
		</a>
	{/if}
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
	input {
		margin-left: 2em;
		flex-grow: 1;
		background-color: var(--sk-back-2);
		border: 1.5px solid var(--sk-back-4);
		font-size: 1.5rem;
		color: var(--sk-text-1);
		padding: 1rem;
		font-family: var(--sk-font);
	}
	input:focus {
		outline: 1px solid var(--sk-theme-1);
	}
</style>
