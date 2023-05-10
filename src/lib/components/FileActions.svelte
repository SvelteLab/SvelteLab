<script lang="ts">
	import { Pane, Splitpanes } from 'svelte-splitpanes';
	import { base_path } from '$lib/stores/base_path_store';
	import FileTree from './file_tree/FileTree.svelte';
	import RunScripts from './RunScripts.svelte';
	export let min_size = 5;
</script>

<Splitpanes horizontal>
	<Pane minSize={min_size}>
		<FileTree base_path={$base_path} />
	</Pane>
	<Pane size={30} minSize={min_size}>
		<RunScripts />
	</Pane>
</Splitpanes>
