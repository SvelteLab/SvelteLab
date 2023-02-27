<script lang="ts">
	import { Pane, Splitpanes } from 'svelte-splitpanes';
	import FileTree from './FileTree.svelte';
	import RunScripts from './RunScripts.svelte';
</script>

<Splitpanes horizontal>
	<Pane size={70}>
		<FileTree />
	</Pane>
	<Pane>
		<RunScripts />
	</Pane>
</Splitpanes>
