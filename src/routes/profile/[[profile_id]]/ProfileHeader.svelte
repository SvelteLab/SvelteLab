<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import Avatar from '$lib/components/Avatar.svelte';
	import { REDIRECT_URI } from '$lib/env';
	import { share } from '$lib/share';
	import { get_theme } from '$lib/theme';
	import { error } from '$lib/toast';
	import SignIn from '~icons/material-symbols/account-circle';
	import Moon from '~icons/material-symbols/dark-mode-rounded';
	import Sun from '~icons/material-symbols/light-mode';
	import SignOut from '~icons/material-symbols/logout-rounded';
	import Share from '~icons/material-symbols/share';

	const theme = get_theme(false);

	$: ({ user, github_login, profile } = $page.data ?? {});
</script>

<header>
	<a href="/" title="New REPL">
		<img src="/logo.svg" alt="svelteblitz logo" />
	</a>
	<h1>{profile?.username ?? 'nobody'} profile</h1>
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
			if (!profile) {
				error('There was a problem sharing this profile');
				return;
			}
			await share({
				text: 'Take a look at my Svelteblitz profile',
				title: `${profile.username} - Svelteblitz`,
				url: `/profile/${profile.id}`
			});
		}}
		title="Share"
	>
		<Share />
	</button>

	{#if user}
		<a href="/profile" class="btn" title="Profile">
			<Avatar alt={`${user.name} profile`} src={`/proxy/?url=${user.avatarUrl}`} />
		</a>
		<form
			use:enhance={() => () => {
				//on logout we invalidate authed:user which reload the page
				invalidate('authed:user');
			}}
			method="POST"
			action="/?/logout"
		>
			<button title="Sign out">
				<SignOut />
			</button>
		</form>
	{:else}
		<a
			class="btn"
			href={`${github_login?.authUrl}${REDIRECT_URI}${$page.url.pathname}`}
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

	h1 {
		font-size: 1.6rem;
		white-space: nowrap;
		text-overflow: ellipsis;
		max-width: 20rem;
		overflow: hidden;
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
</style>
