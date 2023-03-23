<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	let to_add = '';
</script>

<form
	on:submit|preventDefault={() => {
		dispatch('completed');
	}}
>
	<input bind:value={to_add} placeholder="insert route to create" />
</form>

<style>
	input {
		background-color: var(--sk-back-2);
		width: 100%;
		color: var(--sk-text-1);
		padding: 0.5rem;
		border: 0;
		border-radius: 0.5rem;
	}
</style>
