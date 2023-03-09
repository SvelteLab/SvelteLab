<script lang="ts">
	import { Pane, Splitpanes } from 'svelte-splitpanes';
	import FileTree from './FileTree.svelte';
	import RunScripts from './RunScripts.svelte';
	export let minSize = 5;
</script>

<Splitpanes horizontal>
	<Pane {minSize}>
		<FileTree />
	</Pane>
	<Pane size={30} {minSize}>
		<RunScripts />
	</Pane>
</Splitpanes>
