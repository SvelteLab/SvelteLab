<script lang="ts">
	import { Pane, Splitpanes } from 'svelte-splitpanes';
	import { base_path } from '$lib/stores/base_path_store';
	import FileTree from './file_tree/FileTree.svelte';
	import RunScripts from './RunScripts.svelte';
	import MenuBar from '../../routes/(repl)/[[repl]]/MenuBar.svelte';
	import { commands } from '$lib/command_runner/commands';
	export let min_size = 5;
	export let mobile = false;
</script>

<Splitpanes horizontal>
	<Pane minSize={min_size}>
		{#if mobile}
			<div class="menu-bar">
				<MenuBar commands={$commands} />
			</div>
		{/if}
		<FileTree base_path={$base_path} />
	</Pane>
	<Pane size={30} minSize={min_size}>
		<RunScripts />
	</Pane>
</Splitpanes>

<style>
	.menu-bar {
		display: flex;
		gap: 1rem;
		justify-content: space-evenly;
		margin-block: 1rem;
	}
	.menu-bar > :global(button) {
		font-size: 2rem;
	}
</style>
