<script lang="ts" context="module">
	import { writable } from 'svelte/store';

	let open_menu = writable<null | string>(null);
</script>

<script lang="ts">
	import { get_file_icon, get_folder_icon } from '$lib/file_icons';
	import { get_subtree_from_path, is_dir } from '$lib/file_system';
	import { base_path as base_path_store } from '$lib/stores/base_path_store';
	import { expanded_paths, expand_path, toggle_path } from '$lib/stores/expanded_paths';
	import { layout_store } from '$lib/stores/layout_store';
	import { repl_name } from '$lib/stores/repl_id_store';
	import { close_all_subpath, close_file, current_tab, open_file, rename_tab } from '$lib/tabs';
	import { error } from '$lib/toast';
	import { files as files_store, webcontainer } from '$lib/webcontainer';
	import Plus from '~icons/material-symbols/add-rounded';
	import FolderAdd from '~icons/material-symbols/create-new-folder-outline-rounded';
	import Delete from '~icons/material-symbols/delete-outline-rounded';
	import ConfigFiles from '~icons/material-symbols/display-settings-outline-rounded';
	import Sorting from '~icons/material-symbols/drive-folder-upload-outline-rounded';
	import Edit from '~icons/material-symbols/edit';
	import Upload from '~icons/material-symbols/upload';
	import MoreVert from '~icons/material-symbols/more-vert';
	import AddFile from './AddFile.svelte';
	import Dialog from '../Dialog.svelte';
	import { drop, handle_files } from '$lib/drop';
	import DropdownMenu from '../DropdownMenu.svelte';

	export let base_path = './';
	export let is_adding_type: { path: string | null; kind: 'folder' | 'file' | null } = {
		path: null,
		kind: null,
	};
	export let root_adding_type: typeof is_adding_type.kind = null;

	let renaming_path = null as string | null;

	function toggle_menu(path: string) {
		if ($open_menu === path) {
			$open_menu = null;
			return;
		}
		$open_menu = path;
	}

	async function handle_add(
		path_name: string,
		type: typeof is_adding_type.kind,
		content = new ArrayBuffer(0),
		should_open = true
	) {
		const path = path_name.split('/');
		const name = path.pop();
		let prefix = './';
		for (const dir of path) {
			if (dir === '.') continue;
			await webcontainer.add_folder(prefix + dir);
			prefix = prefix + dir + '/';
		}
		if (type === 'file') {
			await webcontainer.add_file(prefix + name, new Uint8Array(content));
			if (should_open) {
				open_file(prefix + name);
			}
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

	let deleting_file = null as null | { kind: 'folder' | 'file'; name: string };

	const files_options = (path = base_path) => ({
		success(file_name: string, file_content: ArrayBuffer) {
			handle_add(`${path}${file_name}`, 'file', file_content, false);
		},
		error(message: unknown) {
			if (typeof message === 'string') {
				error(message);
			}
		},
	});

	function file_input_change(path: string) {
		return (e: Event) => {
			const files = [...((e.currentTarget as HTMLInputElement)?.files ?? [])];
			handle_files(files, files_options(path));
		};
	}

	function get_upload_handler(path = base_path) {
		return () => {
			const file_input = document.createElement('input');
			file_input.type = 'file';
			file_input.multiple = true;
			file_input.addEventListener('change', file_input_change(path), { once: true });
			file_input.click();
		};
	}
</script>

<ul class="file-tree" use:drop={files_options()}>
	{#if base_path === $base_path_store}
		<li class="root">
			<input aria-label="REPL name" bind:value={$repl_name} />
			<div class="hover-group">
				<button title="Upload File" on:click={get_upload_handler()}>
					<Upload />
				</button>
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
					aria-pressed={$layout_store.folders_first}
					on:click={() => {
						layout_store.toggle_sort();
					}}
					title="Toggle Folder / File Sort Order"
				>
					<Sorting />
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
			</div>
		</li>
		{#if root_adding_type}
			<li>
				<AddFile
					type={root_adding_type}
					on:add={async ({ detail: path }) => {
						await handle_add(base_path + path, root_adding_type);
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
		{@const node = tree[node_name]}
		{@const path = base_path + node_name}
		{@const expanded = $expanded_paths.has(path)}
		{@const icon = get_folder_icon(node_name, expanded)}
		{#if is_dir(node)}
			<li use:drop={files_options(path + '/')} class="folder" class:open={expanded}>
				{#if renaming_path === path}
					<AddFile
						type="folder"
						name={node_name}
						on:add={async ({ detail: name }) => {
							if (node_name === name) {
								renaming_path = null;
								return;
							}
							const current_path = node_name.split('/');
							current_path.pop();
							const new_path = `${base_path}${current_path.join('/')}${name}`;
							const process = await webcontainer.spawn('mv', ['-t', new_path, path]);
							const exit_code = await process.exit;
							if (exit_code === 0) {
								await webcontainer.sync_file_system();
								close_all_subpath(path);
								renaming_path = null;
							} else {
								error('There was a problem renaming this folder');
							}
						}}
						on:cancel={() => {
							renaming_path = null;
						}}
					/>
				{:else}
					<button
						class="node"
						on:click={() => {
							toggle_path(path);
						}}
					>
						<svelte:component this={icon} />{node_name}
					</button>
					<div
						class="hover-group"
						on:mouseleave={() => {
							// on mobile we don't want to do this ot
							// it will create problems
							const hover = matchMedia('(hover: none)');
							if (hover.matches) return;
							$open_menu = null;
						}}
					>
						<DropdownMenu open={$open_menu === path}>
							<button
								on:click={() => {
									toggle_menu(path);
								}}
								title="Open Commands"><MoreVert /></button
							>
							<!--
								svelte-ignore a11y-click-events-have-key-events
								this is just here to capture everything from the 
								buttons so no need for keys events
							-->
							<ul
								on:click|capture={() => {
									toggle_menu(path);
								}}
								class="menu"
								slot="menu"
							>
								<li>
									<button title="Upload File" on:click={get_upload_handler(path + '/')}>
										Upload <Upload />
									</button>
								</li>
								<li>
									<button
										title="Edit"
										on:click={() => {
											renaming_path = path;
										}}
									>
										Rename <Edit />
									</button>
								</li>
								<li>
									<button
										title="New File"
										on:click={() => {
											is_adding_type = { path, kind: 'file' };
											expand_path(path);
										}}
									>
										New File <Plus />
									</button>
								</li>
								<li>
									<button
										title="New Folder"
										on:click={() => {
											is_adding_type = { path, kind: 'folder' };
											expand_path(path);
										}}
									>
										New Folder <FolderAdd />
									</button>
								</li>
								<li>
									<button
										title="Delete folder"
										on:click={() => {
											deleting_file = { kind: 'folder', name: node_name };
										}}
									>
										Delete <Delete />
									</button>
								</li>
							</ul>
						</DropdownMenu>
					</div>
				{/if}
			</li>
			{#if expanded}
				<svelte:self base_path={`${base_path}${node_name}/`}>
					{#if is_adding_type.path === path && is_adding_type.kind}
						<li>
							<AddFile
								type={is_adding_type.kind}
								on:add={async ({ detail: name }) => {
									const new_path = `${base_path}${node_name}/${name}`;
									const folder_arr = new_path.split('/');
									const last_part = folder_arr.pop();
									let subtree;
									try {
										subtree = get_subtree_from_path(folder_arr.join('/'), $files_store);
									} catch (e) {
										/* empty */
									}
									if (last_part && subtree?.[last_part]) {
										return error(`The ${is_adding_type.kind} already exist.`);
									}
									await handle_add(`${base_path}${node_name}/${name}`, is_adding_type.kind);
									is_adding_type = { path: null, kind: null };
								}}
								on:cancel={() => {
									is_adding_type = { path: null, kind: null };
								}}
							/>
						</li>
					{/if}
				</svelte:self>
			{/if}
		{:else}
			{@const icon = get_file_icon(node_name)}
			{@const path = base_path + node_name}
			<li class:open={$current_tab === path}>
				{#if renaming_path === path}
					<AddFile
						type="file"
						name={node_name}
						on:add={async ({ detail: name }) => {
							if (name === node_name) {
								renaming_path = null;
								return;
							}
							const current_path = node_name.split('/');
							current_path.pop();
							const new_path = `${base_path}${current_path.join('/')}${name}`;
							const process = await webcontainer.spawn('mv', ['-t', new_path, path]);
							const exit_code = await process.exit;
							if (exit_code === 0) {
								renaming_path = null;
								rename_tab(path, new_path);
							} else {
								error('There was an error renaming this file.');
							}
						}}
						on:cancel={() => {
							renaming_path = null;
						}}
					/>
				{:else}
					<button class="node" on:click={() => open_file(path)}>
						<svelte:component this={icon} />
						<span>
							{node_name}
						</span>
					</button>
					<div class="hover-group">
						<button
							title="Edit"
							on:click={() => {
								renaming_path = path;
							}}
						>
							<Edit />
						</button>
						<button
							title="Delete {node_name}"
							on:click={() => {
								deleting_file = { kind: 'file', name: node_name };
							}}
						>
							<Delete />
						</button>
					</div>
				{/if}
			</li>
		{/if}
	{/each}
</ul>

<Dialog
	is_open={!!deleting_file}
	on:dismiss={() => {
		deleting_file = null;
	}}
>
	<svelte:fragment slot="dialog-title">
		Delete "{deleting_file?.name}" ?
	</svelte:fragment>
	Are you sure you want to delete "{deleting_file?.name}"
	{#if deleting_file?.kind === 'folder'}
		and everything inside?
	{:else}
		?
	{/if}
	<svelte:fragment slot="dialog-actions">
		<button
			style:margin-top="1rem"
			style:color="var(--sk-theme-1)"
			on:click={() => {
				deleting_file = null;
			}}>No</button
		>
		<button
			style:margin-top="1rem"
			on:click={() => {
				webcontainer.delete_file(`${base_path}${deleting_file?.name}`);
				if (deleting_file?.kind === 'file') {
					close_file(`${base_path}${deleting_file?.name}`);
				}
				deleting_file = null;
			}}>Yes</button
		>
	</svelte:fragment>
</Dialog>

<style src="./style.css"></style>
