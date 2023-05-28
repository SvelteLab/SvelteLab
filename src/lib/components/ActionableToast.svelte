<script lang="ts">
	import { toast } from '@zerodevx/svelte-toast';

	export let message = '';
	export let action_message = '';
	export let on_action = () => {
		/**noop*/
	};
	export let toast_id: number;
</script>

<section>
	{message}
	<button
		on:click={() => {
			if (typeof on_action === 'function') {
				on_action();
				toast.pop(toast_id);
			}
		}}>{action_message}</button
	>
</section>

<style>
	section {
		display: flex;
		align-items: center;
		gap: 1rem;
	}
	button {
		background-color: var(--sk-theme-1);
		padding: 0.5rem 1rem;
		border-radius: 0.25rem;
	}
</style>
