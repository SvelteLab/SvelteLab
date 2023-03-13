<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import { PUBLIC_GITHUB_REDIRECT_URI } from '$env/static/public';
	import { save_repl } from '$lib/api/client/repls';
	import Avatar from '$lib/components/Avatar.svelte';
	import { share } from '$lib/share';
	import { layout_store } from '$lib/stores/layout_store';
	import { is_repl_saving, repl_id, repl_name } from '$lib/stores/repl_id_store';
	import { get_theme } from '$lib/theme';
	import { webcontainer } from '$lib/webcontainer';
	import Pending from '~icons/eos-icons/loading';
	import SignIn from '~icons/material-symbols/account-circle';
	import Moon from '~icons/material-symbols/dark-mode-rounded';
	import Fork from '~icons/material-symbols/fork-right-rounded';
	import Sun from '~icons/material-symbols/light-mode';
	import SignOut from '~icons/material-symbols/logout-rounded';
	import FileBrowser from '~icons/material-symbols/menu-rounded';
	import Save from '~icons/material-symbols/save';
	import Share from '~icons/material-symbols/share';
	import Terminal from '~icons/material-symbols/terminal-rounded';

	const theme = get_theme();
	$: ({ user, github_login, repl, owner_id } = $page.data ?? {});

	export let mobile = false;
	let forking = false;
</script>

<header>
	<a href="/" title="New REPL">
		<img src="/logo.svg" alt="svelteblitz logo" />
	</a>
	{#if !mobile}
		<button
			title="Toggle File Browser"
			on:click={layout_store.toggle_file_tree}
			aria-pressed={$layout_store.file_tree}
		>
			<FileBrowser />
		</button>

		<button
			title="Toggle Terminal"
			on:click={layout_store.toggle_terminal}
			aria-pressed={$layout_store.terminal}
		>
			<Terminal />
		</button>
	{/if}
	<div class="grow" />

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
		{:else}
			<Moon />
		{/if}
	</button>

	<button
		on:click={async () => {
			const share_url = await webcontainer.get_share_url();
			await share({
				text: 'Take a look at my REPL',
				title: 'Svelteblitz',
				url: share_url.toString()
			});
		}}
		title="Share"
	>
		<Share />
	</button>

	{#if user}
		<form
			use:enhance={() => {
				forking = true;
				return ({ update }) => {
					forking = false;
					update();
				};
			}}
			method="POST"
			action="?/fork"
		>
			<input type="hidden" value={$repl_id} name="id" />
			<button
				on:click={(e) => {
					if (!window.confirm(`Are you sure you want to fork "${$repl_name}"`)) {
						e.stopPropagation();
						e.preventDefault();
					}
				}}
				title="Fork Project"
			>
				{#if forking}
					<Pending />
				{:else}
					<Fork />
				{/if}
			</button>
		</form>
		{#if !owner_id || user.id === owner_id}
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
		{/if}
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
		--shadow-height: 0.5rem;
		--shadow-gradient: linear-gradient(
			to bottom,
			rgba(0, 0, 0, 0.1) 0%,
			rgba(0, 0, 0, 0.05) 30%,
			transparent 100%
		);
	}

	header:after {
		content: '';
		position: absolute;
		width: 100%;
		height: var(--shadow-height);
		left: 0;
		bottom: calc(-1 * var(--shadow-height));
		background: var(--shadow-gradient);
	}

	.grow {
		flex-grow: 1;
	}

	img {
		width: 3rem;
		aspect-ratio: 1;
	}

	button {
		font-size: 1.25em;
		display: grid;
		place-items: center;
		position: relative;
		padding-block: 0.25rem;
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
