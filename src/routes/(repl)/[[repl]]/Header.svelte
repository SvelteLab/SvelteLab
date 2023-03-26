<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import { PUBLIC_SAVE_IN_LOCAL_STORAGE_NAME } from '$env/static/public';
	import { save_repl } from '$lib/api/client/repls';
	import AsyncButton from '$lib/components/AsyncButton.svelte';
	import Avatar from '$lib/components/Avatar.svelte';
	import { share_with_hash, share_with_id } from '$lib/share';
	import { command_runner } from '$lib/stores/command_runner_store';
	import { layout_store } from '$lib/stores/layout_store';
	import { is_repl_saving, is_repl_to_save, repl_id, repl_name } from '$lib/stores/repl_id_store';
	import { get_theme } from '$lib/theme';
	import { async_click } from '$lib/utils';
	import { webcontainer } from '$lib/webcontainer';
	import { onMount } from 'svelte';
	import Profile from '~icons/material-symbols/account-circle';
	import Moon from '~icons/material-symbols/dark-mode-rounded';
	import Download from '~icons/material-symbols/download-rounded';
	import Fork from '~icons/material-symbols/fork-right-rounded';
	import Cmd from '~icons/material-symbols/keyboard-command-key';
	import Sun from '~icons/material-symbols/light-mode';
	import Url from '~icons/material-symbols/link';
	import SignOut from '~icons/material-symbols/logout-rounded';
	import FileBrowser from '~icons/material-symbols/menu-rounded';
	import Save from '~icons/material-symbols/save';
	import Share from '~icons/material-symbols/share';
	import Tag from '~icons/material-symbols/tag-rounded';
	import Terminal from '~icons/material-symbols/terminal-rounded';
	import { on_command } from '../command_runner/commands';

	const theme = get_theme();
	$: ({ user, github_login, owner_id, REDIRECT_URI } = $page.data ?? {});
	export let mobile = false;
	let forking = false;
	let fork_form: HTMLFormElement;
	let open_menu = null as null | 'share' | 'profile';

	function toggle_menu(kind: typeof open_menu & {}) {
		open_menu = open_menu === kind ? null : kind;
	}

	onMount(() => {
		return on_command('fork', () => {
			fork_form.submit();
		});
	});
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
		on:click={() => {
			command_runner.open();
		}}
		title="Open Command Runner (CTRL+E)"
	>
		<Cmd />
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
		{:else}
			<Moon />
		{/if}
	</button>
	{#if !$repl_id}
		<button
			on:click={async () => {
				share_with_hash();
			}}
			title="Share via Hash"
		>
			<Share />
		</button>
	{:else}
		<div class="drop-down-wrapper">
			<button
				on:click={async () => {
					toggle_menu('share');
				}}
				title="Share"
			>
				<Share />
			</button>
			<ul aria-hidden={open_menu !== 'share'}>
				<li>
					<button
						title="Share via id"
						on:click={() => {
							share_with_id();
							open_menu = null;
						}}><Url /> Share via id</button
					>
				</li>
				<li>
					<button
						title="Share via hash"
						on:click={() => {
							share_with_hash();
							open_menu = null;
						}}><Tag /> Share via hash</button
					>
				</li>
			</ul>
		</div>
	{/if}
	<AsyncButton
		click={async () => {
			await webcontainer.save_as_zip();
		}}
	>
		<Download />
	</AsyncButton>

	{#if user}
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
		<div class="drop-down-wrapper">
			<button
				on:click={() => {
					toggle_menu('profile');
				}}
			>
				<Avatar alt={`${user.name} profile`} src={`./proxy/?url=${user.avatarUrl}`} />
			</button>
			<ul class="right-aligned" aria-hidden={open_menu !== 'profile'}>
				<li>
					<a href="/profile" class="btn" title="Profile"><Profile /> Your profile</a>
				</li>
				<li>
					<form
						use:enhance={() => {
							open_menu = null;
							return () => {
								//on logout we invalidate authed:user which reload the page
								invalidate('authed:user');
							};
						}}
						method="POST"
						action="?/logout"
					>
						<button title="Sign out">
							<SignOut /> Log out
						</button>
					</form>
				</li>
			</ul>
		</div>
	{:else}
		<a
			use:async_click={async (e) => {
				try {
					// save current project to local storage (we have to use local instead
					// of session because Firefox Mobile it's being weird)
					window.localStorage.setItem(
						PUBLIC_SAVE_IN_LOCAL_STORAGE_NAME,
						JSON.stringify(await webcontainer.get_tree_from_container())
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
			class="btn"
			href={`${github_login?.authUrl}${REDIRECT_URI}${$page.url.pathname}`}
			title="Login with GitHub"
		>
			<Profile />
		</a>
	{/if}
</header>

<style>
	header {
		--padding-y: 0.75em;
		padding: var(--padding-y) 1.5em;
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
	ul[aria-hidden='true'] {
		display: none;
	}
	.drop-down-wrapper {
		position: relative;
	}
	.drop-down-wrapper::after {
		content: '▾';
		position: absolute;
		bottom: -0.5rem;
		right: -0.5rem;
		font-family: monospace;
		font-size: 1rem;
	}
	ul {
		position: absolute;
		background-color: var(--sk-back-4);
		list-style: none;
		top: calc(100% + var(--padding-y));
		padding: 0;
		margin: 0;
		left: 0;
		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 20%), 0 2px 4px -2px rgb(0 0 0 / 20%);
		z-index: 10;
	}
	ul :last-child {
		border-bottom-left-radius: 0.2em;
		border-bottom-right-radius: 0.2em;
	}
	.right-aligned {
		left: auto;
		right: 0;
	}
	li :is(button, a) {
		background-color: var(--sk-back-1);
		display: flex;
		gap: 1rem;
		width: 100%;
		padding: 0.75rem;
		white-space: nowrap;
		font-size: 1.6rem;
		isolation: isolate;
	}
	li :is(button, a):focus-visible {
		/* this is to always show the outline on top */
		z-index: 20;
	}
</style>
