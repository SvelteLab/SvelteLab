<script lang="ts">
	import File from '~icons/material-symbols/unknown-document-rounded';

	export let loading = false;
</script>

{#if !loading}
	<div class="loader">
		<File />
		<span>Open a file to start editing</span>
	</div>
{:else}
	<div class="loader" />
{/if}

<style>
	div {
		background-color: var(--sk-back-1);
		grid-row: 1/-1;
	}
</style>
