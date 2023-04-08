<script lang="ts">
	import { browser, dev } from '$app/environment';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { PUBLIC_GITHUB_REPO, PUBLIC_SAVE_IN_LOCAL_STORAGE_NAME } from '$env/static/public';
	import CommandRunner from '$lib/command_runner/CommandRunner.svelte';
	import { commands } from '$lib/command_runner/commands';
	import Credits from '$lib/components/Credits.svelte';
	import Logo from '$lib/components/Logo.svelte';
	import { is_intro_open } from '$lib/stores/intro_store';
	import { is_repl_to_save, repl_id, repl_name } from '$lib/stores/repl_id_store';
	import { webcontainer } from '$lib/webcontainer';
	import SvelteCompiler from '$lib/workers/svelte-compiler?worker';
	import { decompressFromEncodedURIComponent } from 'lz-string';
	import { onMount, setContext } from 'svelte';
	import { fly } from 'svelte/transition';
	import Close from '~icons/material-symbols/close-rounded';
	import GitHub from '~icons/mdi/github';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	// keep the repl stores up to date in case data changes
	$: repl_id.set(data.id);
	$: repl_name.set(data.repl_name);
	$: webcontainer.set_file_system(data.repl!);

	let fix_for_double_after = false;

	const onbeforeunload_handler = (e: BeforeUnloadEvent) =>
		'You will lose your progress are you sure you want to close?';

	function handle_unload(is_repl_to_save: boolean) {
		if (!browser || dev) return;
		if (is_repl_to_save) {
			window.onbeforeunload = onbeforeunload_handler;
		} else {
			window.onbeforeunload = null;
		}
	}

	$: handle_unload($is_repl_to_save);

	const svelte_compiler = new SvelteCompiler();
	svelte_compiler.postMessage({ type: 'init' });
	setContext('svelte-compiler', svelte_compiler);

	onMount(() => {
		setTimeout(() => {
			$is_intro_open = true;
		}, 500);
	});

	afterNavigate(async () => {
		if (fix_for_double_after) return;
		fix_for_double_after = true;
		// try to get the project from local storage and then delete it
		const stored_project = window.localStorage.getItem(PUBLIC_SAVE_IN_LOCAL_STORAGE_NAME);
		if (stored_project !== null) {
			try {
				const project = JSON.parse(stored_project);
				await webcontainer.set_file_system(project);
			} catch (e) {
				/* empty */
			}
			window.localStorage.removeItem(PUBLIC_SAVE_IN_LOCAL_STORAGE_NAME);
		} else {
			// check if there's the hash
			const hash = window.location.hash.substring(1);
			if (hash) {
				const url_search_params = new URLSearchParams(hash);
				const code = url_search_params.get('code');
				if (code) {
					const project = decompressFromEncodedURIComponent(code);
					try {
						const to_mount = JSON.parse(project);
						await webcontainer.set_file_system(to_mount);
					} catch (e) {
						/* empty */
					}
				}
			}
		}

		webcontainer.init().then(() => webcontainer.mount_files());
		// for debugging
		(window as any).wc = webcontainer;
	});

	beforeNavigate(() => {
		fix_for_double_after = false;
		$webcontainer.running_process?.kill?.();
	});
</script>

<slot />

<CommandRunner commands={$commands} />
<Credits />
{#if $is_intro_open}
	<aside
		class="center"
		transition:fly={{
			y: '100%'
		}}
	>
		<button
			title="Close tootlip"
			on:click={() => {
				$is_intro_open = false;
			}}><Close /></button
		>
		<p class="title">
			You are using <span>
				<Logo /> SvelteLab
			</span>
		</p>
		<p><em>a supercharged REPL for Svelte</em></p>
		<a href="{PUBLIC_GITHUB_REPO}#readme" target="_blank" rel="noopener noreferrer"
			><GitHub /> Learn more on GitHub</a
		>
	</aside>
{/if}

<aside class="github">
	<a
		title="Go to GitHub"
		href="{PUBLIC_GITHUB_REPO}#readme"
		target="_blank"
		rel="noopener noreferrer"><GitHub /></a
	>
</aside>

<style>
	aside {
		background-color: var(--sk-back-3);
		box-shadow: 0 -4px 6px -1px rgb(0 0 0 / 30%), 0 -2px 4px -2px rgb(0 0 0 / 70%);
		position: fixed;
		bottom: 0;
		z-index: 99;
	}
	.github > a {
		font-size: 2.25rem;
		color: white;
		padding: 0.5rem;
		box-shadow: 0 -4px 6px -1px rgb(0 0 0 / 30%), 0 -2px 8px -2px var(--sk-theme-1);
		border-top-right-radius: 1rem;
	}
	.center {
		--padding-x: 3rem;
		--padding-y: 2rem;
		left: 50%;
		transform: translateX(-50%);
		padding: var(--padding-y) var(--padding-x);
		border-top-left-radius: 2rem;
		border-top-right-radius: 2rem;
		display: grid;
		gap: 0.25rem;
	}
	.center > button {
		justify-self: end;
		margin: calc(var(--padding-y) * -1 + 1rem) calc(var(--padding-x) * -1 + 1rem);
	}
	p,
	a,
	span {
		margin: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
	}
	.title {
		font-size: 2rem;
		font-weight: bold;
	}
	@media (max-width: 500px) {
		.github {
			display: none;
		}
		.center {
			min-width: 80%;
		}
		.title {
			flex-direction: column;
			gap: 0;
		}
	}
</style>
