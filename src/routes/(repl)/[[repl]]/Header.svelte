<script lang="ts">
	import { enhance } from '$app/forms';
	import SearchDocsIcon from '~icons/sveltelab/svelte-lib';
	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import { PUBLIC_SAVE_IN_LOCAL_STORAGE_NAME } from '$env/static/public';
	import { save_repl } from '$lib/api/client/repls';
	import { on_command } from '$lib/command_runner/commands';
	import AsyncButton from '$lib/components/AsyncButton.svelte';
	import Avatar from '$lib/components/Avatar.svelte';
	import Logo from '$lib/components/Logo.svelte';
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
	import { parseKeybinding } from 'tinykeys';

	// TODO: dedupe header and profile header (use slots for specific buttons?)

	const theme = get_theme();
	$: ({ user, github_login, owner_id, REDIRECT_URI } = $page.data ?? {});
	export let mobile = false;
	let forking = false;
	let fork_form: HTMLFormElement;
	let open_menu = null as null | 'share' | 'profile';

	const search_docs_keys = parseKeybinding('$mod+alt+K')
		.flat(Infinity)
		.map((key) => key.toString().replace('Control', 'Ctrl'));

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
		<Logo />
	</a>
	{#if !mobile}
		<button
			title="Toggle File Browser"
			on:click={layout_store.toggle_file_tree}
			aria-pressed={$layout_store.file_tree !== 0}
		>
			<FileBrowser /> Files
		</button>

		<button
			title="Toggle Terminal"
			on:click={layout_store.toggle_terminal}
			aria-pressed={$layout_store.terminal !== 0}
		>
			<Terminal /> Terminal
		</button>
	{/if}
	<div class="grow">
		<button
			class="search-docs"
			on:click={() => {
				command_runner.open('search-docs');
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
						title="Share Project"
						on:click={() => {
							share_with_id();
							open_menu = null;
						}}><Url /> Share Project</button
					>
				</li>
				<li>
					<button
						title="Share Code Snapshot"
						on:click={() => {
							share_with_hash();
							open_menu = null;
						}}
						><Tag /> Share Code Snapshot
					</button>
				</li>
			</ul>
		</div>
	{/if}
	{#if user}
		<!-- Profile or login -->
		<div class="drop-down-wrapper">
			<button
				on:click={() => {
					toggle_menu('profile');
				}}
			>
				<Avatar alt={`${user.name} profile`} src={`./proxy/?url=${user.avatarUrl}`} />
			</button>
			<ul aria-hidden={open_menu !== 'profile'}>
				<li>
					<a href="/profile" title="Profile"><Profile /> Your profile</a>
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

	.grow {
		width: 100%;
	}

	form {
		flex-shrink: 0;
	}

	.search-docs {
		border-radius: 0.5rem;
		margin: auto;
		max-width: 42rem;
		font-size: 1.1rem;
		border: 1px solid var(--sk-back-5);
		width: 100%;
		justify-content: center;
		opacity: 0.8;
	}

	.search-docs > div {
		display: flex;
		gap: 0.25rem;
		margin-inline-start: auto;
	}

	kbd {
		padding: 0.25rem 0.5rem;
	}

	a,
	button {
		gap: 1rem;
		display: flex;
		align-items: center;
		position: relative;
		padding: 0.5rem;
		color: var(--sk-text-1);
		flex-shrink: 0;
	}

	a :global(svg),
	button :global(svg) {
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
	ul[aria-hidden='true'] {
		display: none;
	}
	.drop-down-wrapper {
		position: relative;
		flex-shrink: 0;
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
		list-style: none;
		top: calc(100% + var(--padding-y));
		padding: 0;
		margin: 0;
		right: 0;
		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 20%), 0 2px 4px -2px rgb(0 0 0 / 20%);
		z-index: 10;
		border-bottom-left-radius: 0.5em;
		border-bottom-right-radius: 0.5em;
	}
	ul > :last-child {
		border-bottom-left-radius: 0.5em;
		border-bottom-right-radius: 0.5em;
		overflow: hidden;
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
	.login {
		color: var(--sk-theme-1);
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
