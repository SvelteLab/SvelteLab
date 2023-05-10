<script lang="ts">
	import { file_status } from '$lib/stores/repl_id_store';
	export let path = '';
	export let file_name = '';

	let isEdited = file_status.isFileEdited(path);
</script>

{file_name}{#if $isEdited}*{/if}
