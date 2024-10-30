<!-- @migration-task Error while migrating Svelte code: $$props is used together with named props in a way that cannot be automatically migrated. -->
<script lang="ts">
	export let type = 'p'

	delete $$restProps.class
</script>

<svelte:element
	this={type}
	class="r-stretch {$$props.class || ''}"
	{...$$restProps}
>
	<slot />
</svelte:element>
