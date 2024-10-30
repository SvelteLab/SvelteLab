<!-- @migration-task Error while migrating Svelte code: $$props is used together with named props in a way that cannot be automatically migrated. -->
<script lang="ts">
	export let type = 'h2'

	delete $$restProps.class
</script>

<svelte:element
	this={type}
	class="r-fit-text {$$props.class || ''}"
	{...$$restProps}
>
	<slot />
</svelte:element>
