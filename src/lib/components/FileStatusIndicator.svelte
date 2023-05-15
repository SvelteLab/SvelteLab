<script lang="ts">
	import { file_status } from '$lib/stores/repl_id_store';
	export let path = '';

	let is_edited = file_status.is_file_edited(path);
</script>

{#if $is_edited}*{/if}
