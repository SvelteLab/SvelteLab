<script lang="ts">
	import { get_folder_icon, get_icon } from '$lib/file_icons';
	import { get_subtree_from_path, is_dir } from '$lib/file_system';
	import { base_path as base_path_store } from '$lib/stores/base_path_store';
	import { layout_store } from '$lib/stores/layout_store';
	import { repl_name } from '$lib/stores/repl_id_store';
	import { current_tab, open_file } from '$lib/tabs';
	import { files as files_store, webcontainer } from '$lib/webcontainer';
	import Plus from '~icons/material-symbols/add-rounded';
	import FolderAdd from '~icons/material-symbols/create-new-folder-outline-rounded';
	import Delete from '~icons/material-symbols/delete-outline-rounded';
	import ConfigFiles from '~icons/material-symbols/display-settings-outline-rounded';
	import Sorting from '~icons/material-symbols/swap-vert-rounded';
	import AddFile from './AddFile.svelte';

	export let base_path = './';
	export let is_adding_type: 'folder' | 'file' | null = null;
	export let root_adding_type: typeof is_adding_type = null;

	async function handleAdd(path_name: string, type: typeof is_adding_type) {
		const path = path_name.split('/');
		const name = path.pop();
		let prefix = '/';
		for (const dir of path) {
			if (dir === '.') continue;
			await webcontainer.add_folder(prefix + dir);
			prefix = prefix + dir + '/';
		}
		if (type === 'file') {
			await webcontainer.add_file(prefix + name);
		} else if (type === 'folder') {
			await webcontainer.add_folder(prefix + name);
		}
	}

	$: tree = get_subtree_from_path(base_path, $files_store);
	$: nodes = Object.keys(tree ?? {}).sort((node_a, node_b) => {
		// if they are both dirs order alphabetically
		if (is_dir(tree[node_a]) && is_dir(tree[node_b])) {
			return node_a.localeCompare(node_b);
		}

		if (!$layout_store.folders_first) {
			//if file_one is dir put it last
			if (is_dir(tree[node_a])) return 1;
			//if file_two is dir put it last
			if (is_dir(tree[node_b])) return -1;
		} else {
			//if file_one is dir put it last
			if (is_dir(tree[node_a])) return -1;
			//if file_two is dir put it last
			if (is_dir(tree[node_b])) return 1;
		}
		//if they are both files order alphabetically
		return node_a.localeCompare(node_b);
	});
</script>

<ul>
	{#if base_path === $base_path_store}
		<li class="root">
			<input aria-label="REPL name" bind:value={$repl_name} />
			<div class="hover-group">
				<button
					title="New File"
					on:click={() => {
						root_adding_type = 'file';
					}}
				>
					<Plus />
				</button>
				<button
					title="New Folder"
					on:click={() => {
						root_adding_type = 'folder';
					}}
				>
					<FolderAdd />
				</button>
				<button
					aria-pressed={$layout_store.show_config}
					on:click={() => {
						layout_store.toggle_config();
					}}
					title="Toggle Config Files"
				>
					<ConfigFiles />
				</button>
				<button
					aria-pressed={$layout_store.folders_first}
					on:click={() => {
						layout_store.toggle_sort();
					}}
					title="Toggle Folder / File Sort Order"
				>
					<Sorting />
				</button>
			</div>
		</li>
		{#if root_adding_type}
			<li>
				<AddFile
					type={root_adding_type}
					on:add={async ({ detail: path }) => {
						await handleAdd(path, root_adding_type);
						root_adding_type = null;
					}}
					on:cancel={() => {
						root_adding_type = null;
					}}
				/>
			</li>
		{/if}
	{/if}
	<slot />
	{#each nodes as node_name}
		{@const icon = get_folder_icon(node_name)}
		{@const node = tree[node_name]}
		{#if is_dir(node)}
			<li class="folder" class:open={node.open}>
				<button
					class="node"
					on:click={() => {
						// @ts-ignore
						tree[node_name].open = !node.open;
					}}
				>
					<svelte:component this={icon} />{node_name}
				</button>
				<div class="hover-group">
					<button
						title="New File"
						on:click={() => {
							is_adding_type = 'file';
							// @ts-ignore
							tree[node_name].open = true;
						}}
					>
						<Plus />
					</button>
					<button
						title="New Folder"
						on:click={() => {
							is_adding_type = 'folder';
							// @ts-ignore
							tree[node_name].open = true;
						}}
					>
						<FolderAdd />
					</button>
					<button
						title="Delete folder"
						on:click={() => {
							/// TODO: use proper component
							if (
								window.confirm(
									`Are you sure you want to delete "${node_name}" and everything inside?`
								)
							) {
								webcontainer.delete_file(`${base_path}${node_name}`);
							}
						}}
					>
						<Delete />
					</button>
				</div>
			</li>
			{#if node.open}
				<svelte:self base_path={`${base_path}${node_name}/`}>
					{#if is_adding_type}
						<li>
							<AddFile
								type={is_adding_type}
								on:add={async ({ detail: name }) => {
									await handleAdd(`${base_path}${node_name}/${name}`, is_adding_type);
									is_adding_type = null;
								}}
								on:cancel={() => {
									is_adding_type = null;
								}}
							/>
						</li>
					{/if}
				</svelte:self>
			{/if}
		{:else}
			{@const icon = get_icon(node_name)}
			{@const path = base_path + node_name}
			<li class:open={$current_tab === path}>
				<button class="node" on:click={() => open_file(path)}>
					<svelte:component this={icon} />
					<span>
						{node_name}
					</span>
				</button>
				<div class="hover-group">
					<button
						title="Delete {node_name}"
						on:click={() => {
							/// TODO: use proper component
							if (window.confirm(`Are you sure you want to delete "${node_name}"?`)) {
								webcontainer.delete_file(`${base_path}${node_name}`);
							}
						}}
					>
						<Delete />
					</button>
				</div>
			</li>
		{/if}
	{/each}
</ul>

<style src="./style.css"></style>