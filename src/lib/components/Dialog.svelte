<script lang="ts">
	import { Dialog } from 'as-comps';
	export let is_open = false;
	export let padding = '3rem';
</script>

<Dialog
	--as-dialog-container-z-index="9999"
	--as-dialog-width="max-content"
	--as-dialog--actions-justify-content="flex-end"
	--as-dialog--actions--child-button-flex-grow="0"
	--as-dialog-border-radius=".5rem"
	--as-dialog-background="var(--sk-back-2)"
	--as-dialog-padding={padding}
	noCloseButton
	autofocus={false}
	isOpen={is_open}
	includedTrigger={false}
	on:dismiss
>
	<h2><slot name="dialog-title" /></h2>
	<slot />
	<svelte:fragment slot="dialog-actions">
		<slot name="dialog-actions" />
	</svelte:fragment>
</Dialog>
