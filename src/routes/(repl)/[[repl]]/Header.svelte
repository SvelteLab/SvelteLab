<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import { PUBLIC_SAVE_IN_LOCAL_STORAGE_NAME } from '$env/static/public';
	import { save_repl } from '$lib/api/client/repls';
	import { commands, on_command } from '$lib/command_runner/commands';
	import AsyncButton from '$lib/components/AsyncButton.svelte';
	import Avatar from '$lib/components/Avatar.svelte';
	import DropdownMenu from '$lib/components/DropdownMenu.svelte';
	import Logo from '$lib/components/Logo.svelte';
	import MenuItem from '$lib/components/MenuItem.svelte';
	import { stringify } from '$lib/components/parsers';
	import { share_with_hash, share_with_id } from '$lib/share';
	import { command_runner } from '$lib/stores/command_runner_store';
	import { layout_store } from '$lib/stores/layout_store';
	import { is_repl_saving, is_repl_to_save, repl_id, repl_name } from '$lib/stores/repl_id_store';
	import { get_theme } from '$lib/theme';
	import { async_click } from '$lib/utils';
	import { webcontainer } from '$lib/webcontainer';
	import { onMount } from 'svelte';
	import { parseKeybinding } from 'tinykeys';
	import Profile from '~icons/material-symbols/account-circle';
	import AddNew from '~icons/material-symbols/add-circle-rounded';
	import Moon from '~icons/material-symbols/dark-mode-rounded';
	import Docs from '~icons/material-symbols/docs';
	import Fork from '~icons/material-symbols/fork-right-rounded';
	import Cmd from '~icons/material-symbols/keyboard-command-key';
	import Sun from '~icons/material-symbols/light-mode';
	import Url from '~icons/material-symbols/link';
	import Login from '~icons/material-symbols/login-rounded';
	import SignOut from '~icons/material-symbols/logout-rounded';
	import FileBrowser from '~icons/material-symbols/menu-rounded';
	import Save from '~icons/material-symbols/save';
	import Share from '~icons/material-symbols/share';
	import Tag from '~icons/material-symbols/tag-rounded';
	import Terminal from '~icons/material-symbols/terminal-rounded';
	import SearchDocsIcon from '~icons/sveltelab/svelte-lib';
	import MenuBar from './MenuBar.svelte';

	// TODO: dedupe header and profile header (use slots for specific buttons?)

	const theme = get_theme();
	$: ({ user, github_login, owner_id, REDIRECT_URI } = $page.data ?? {});
	export let mobile = false;
	let forking = false;
	let fork_form: HTMLFormElement;

	const search_docs_keys = parseKeybinding('$mod+alt+K')
		.flat(Infinity)
		.map((key) => key.toString().replace('Control', 'Ctrl'));

	onMount(() => {
		return on_command('fork', () => {
			fork_form.submit();
		});
	});

	let a_hover = false;
</script>

<header>
	<a
		href="/"
		title="New REPL"
		class="logo"
		on:mouseenter={() => (a_hover = true)}
		on:mouseleave={() => (a_hover = false)}
	>
		{#if !a_hover}
			<Logo />
		{:else}
			<AddNew />
		{/if}
	</a>
	<MenuBar commands={$commands} />
	{#if !mobile}
		<button
			title="Toggle File Browser"
			on:click={layout_store.toggle_file_tree}
			aria-pressed={$layout_store.file_tree !== 0}
		>
			<FileBrowser />
		</button>

		<button
			title="Toggle Terminal"
			on:click={layout_store.toggle_terminal}
			aria-pressed={$layout_store.terminal !== 0}
		>
			<Terminal />
		</button>
	{/if}
	<div class="grow">
		<button
			class="search-docs"
			on:click={() => {
				command_runner.open('search-kit-docs');
			}}
			title="Search sveltekit documentation"
			><SearchDocsIcon /> Search SvelteKit Documentation...
			<div>
				{#each search_docs_keys as key}
					<kbd>{key}</kbd>
				{/each}
			</div>
		</button>
	</div>
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
	<a href="http://docs.sveltelab.dev/" target="_blank" title="SvelteLab Docs">
		<Docs />
	</a>
	<button
		on:click={() => {
			command_runner.open('> ');
		}}
		title="Open Command Runner (CTRL+K)"
	>
		<Cmd />
	</button>

	{#if user}
		<!-- Fork button -->
		{#if $repl_id}
			<form
				bind:this={fork_form}
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
				<AsyncButton
					click={(e) => {
						if (!window.confirm(`Are you sure you want to fork "${$repl_name}"`)) {
							e.stopPropagation();
							e.preventDefault();
						}
					}}
					title="Fork Project"
					loading={forking}
				>
					<Fork />
				</AsyncButton>
			</form>
		{/if}
		<!-- Save button -->
		{#if !owner_id || user.id === owner_id}
			<AsyncButton
				badged={$is_repl_to_save}
				click={async () => {
					await save_repl();
				}}
				title="Save Changes"
				loading={$is_repl_saving}
			>
				<Save />
			</AsyncButton>
		{/if}
	{/if}
	<!-- Share button or dropdown -->
	{#if !$repl_id}
		<button
			on:click={async () => {
				share_with_hash();
			}}
			title="Share Files Snapshot"
		>
			<Share />
		</button>
	{:else}
		<DropdownMenu indicator>
			<svelte:fragment slot="trigger">
				<Share />
			</svelte:fragment>
			<MenuItem
				on:click={() => {
					share_with_id();
				}}
			>
				<Url /> Share Project
			</MenuItem>
			<MenuItem
				on:click={() => {
					share_with_hash();
				}}
				><Tag /> Share Code Snapshot
			</MenuItem>
		</DropdownMenu>
	{/if}
	{#if user}
		<!-- Profile or login -->
		<DropdownMenu indicator>
			<svelte:fragment slot="trigger">
				<Avatar alt={`${user.name} profile`} src={`./proxy/?url=${user.avatarUrl}`} />
			</svelte:fragment>
			<MenuItem href="/profile"><Profile /> Your profile</MenuItem>
			<form
				use:enhance={() => {
					return () => {
						//on logout we invalidate authed:user which reload the page
						invalidate('authed:user');
					};
				}}
				method="POST"
				action="?/logout"
			>
				<MenuItem>
					<SignOut /> Log out
				</MenuItem>
			</form>
		</DropdownMenu>
	{:else}
		<a
			use:async_click={async () => {
				try {
					// save current project to local storage (we have to use local instead
					// of session because Firefox Mobile it's being weird)
					window.localStorage.setItem(
						PUBLIC_SAVE_IN_LOCAL_STORAGE_NAME,
						stringify(await webcontainer.get_tree_from_container(true))
					);
				} catch (e) {
					if (
						!window.confirm('You will lose progress on this project...do you want to continue?')
					) {
						// this will prevent the actual navigation
						throw new Error('');
					}
				}
			}}
			class="login"
			href={`${github_login?.authUrl}${REDIRECT_URI}${$page.url.pathname}`}
			title="Login with GitHub"
		>
			<Login /> <span>Login with GitHub</span>
		</a>
	{/if}
</header>

<style>
	header {
		--padding-y: 0.5em;
		padding: var(--padding-y) 1em;
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

	header > :global(:not(.grow)) {
		flex-shrink: 0;
	}

	.grow {
		width: 100%;
	}

	.search-docs {
		border-radius: 0.5rem;
		margin: auto;
		max-width: 42rem;
		font-size: 1.1rem;
		color: var(--sk-text-2);
		border: 1px solid var(--sk-back-5);
		width: 100%;
		justify-content: center;
		opacity: 0.8;
	}

	.search-docs:hover {
		border-color: var(--sk-theme-1);
		color: var(--sk-text-1);
	}

	.search-docs > div {
		display: flex;
		gap: 0.25rem;
		margin-inline-start: auto;
	}

	kbd {
		padding: 0.25rem 0.5rem;
	}

	header :global(a),
	header :global(button) {
		gap: 0.5rem;
		display: flex;
		align-items: center;
		position: relative;
		padding: 0.5rem;
		color: var(--sk-text-1);
	}

	header :global(a):hover,
	header :global(button):hover {
		color: var(--sk-theme-1);
	}

	header :global(a) :global(svg),
	header :global(button) :global(svg) {
		font-size: 1.25em;
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

	.logo {
		scale: 1.5;
	}

	.login {
		padding: 0.5rem 1rem 0.5rem 1rem;
		border-block-start-color: transparent;
		border-inline-color: transparent;
		color: var(--sk-theme-1);

		border-radius: 0.5rem;
	}

	.login:hover {
		background-color: var(--sk-theme-1);
		color: #fff;
	}

	@media only screen and (max-width: 500px) {
		a span {
			display: none;
		}
	}

	@media only screen and (max-width: 900px) {
		.search-docs {
			display: none;
		}
	}
</style>
