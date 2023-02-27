<script lang="ts">
	import { get_subtree_from_path, is_dir } from '$lib/utils/file_system';
	import { get_icon } from '$lib/utils/icons';
	import { files as files_store, webcontainer } from '$lib/webcontainer';
	import Folder from '~icons/akar-icons/folder';
	export let base_path = './';

	$: tree = get_subtree_from_path(base_path, $files_store);
	$: files = Object.keys(tree ?? {});
</script>

<ul>
	{#each files as file}
		{@const file_const = tree[file]}
		{#if is_dir(file_const)}
			<li>
				<button on:click={() => (tree[file].open = !file_const.open)}><Folder />{file}</button>
			</li>
			{#if file_const.open}
				<svelte:self base_path={`${base_path}${file}/`} />
			{/if}
		{:else}
			{@const icon = get_icon(file)}
			{@const path = base_path + file}
			<li class:open={$webcontainer.current_path === path}>
				<button on:click={() => webcontainer.open_file(path)}
					><svelte:component this={icon} />{file}</button
				>
			</li>
		{/if}
	{/each}
</ul>

<style>
	ul {
		list-style: none;
		margin: 0;
		padding: 1rem;
		background-color: var(--sk-back-1);
		height: 100%;
	}
	/*style reset for nested folders*/
	ul :global(ul) {
		height: auto;
		padding-block: 0;
	}
	li {
		border-bottom: 1px solid var(--sk-back-4);
		color: var(--sk-text-1);
		overflow: hidden;
		white-space: nowrap;
		padding: 0.5rem;
	}
	li.open {
		color: var(--sk-theme-1);
		position: relative;
	}
	li.open::after {
		content: '';
		position: absolute;
		background-color: var(--sk-theme-1);
		inset: 0;
		top: calc(100% - 3px);
	}
	button {
		display: flex;
		gap: 0.5rem;
		padding: 0;
		border: 0;
	}
</style>
