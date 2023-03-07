<script lang="ts">
	import { Pane, Splitpanes } from 'svelte-splitpanes';
	import FileTree from './FileTree.svelte';
	import RunScripts from './RunScripts.svelte';
	export let minSize: number;
</script>

<Splitpanes horizontal>
	<Pane size={70} {minSize}>
		<FileTree />
	</Pane>
	<Pane {minSize}>
		<RunScripts />
	</Pane>
</Splitpanes>
