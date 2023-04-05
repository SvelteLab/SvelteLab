<script lang="ts">
	import { Dialog } from 'as-comps';
	export let is_open = false;
</script>

<Dialog
	--as-dialog-container-z-index="9999"
	--as-dialog-width="max-content"
	--as-dialog--actions-justify-content="flex-end"
	--as-dialog--actions--child-button-flex-grow="0"
	--as-dialog-border-radius=".5rem"
	--as-dialog-background="var(--sk-back-2)"
	--as-dialog-padding="3rem"
	noCloseButton
	autofocus={false}
	isOpen={is_open}
	includedTrigger={false}
>
	<h1><slot name="dialog-title" /></h1>
	<slot />
	<svelte:fragment slot="dialog-actions">
		<slot name="dialog-actions" />
	</svelte:fragment>
</Dialog>

<style>
	h1 {
		font-size: 2rem;
		display: flex;
		gap: 1rem;
		color: var(--sk-theme-1);
		font-weight: bold;
	}
</style>
