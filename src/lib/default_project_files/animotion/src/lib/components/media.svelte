<!-- @migration-task Error while migrating Svelte code: $$props is used together with named props in a way that cannot be automatically migrated. -->
<script lang="ts">
	type Bool = boolean | null
	type Element = 'video' | 'image' | 'iframe'

	export let type: Element
	export let src: string
	export let autoplay: Bool = null
	export let preload: Bool = null

	delete $$restProps.class
</script>

<svelte:element
	this={type}
	data-src={src}
	data-autoplay={autoplay}
	data-prelod={preload}
	class={$$props.class || ''}
	{...$$restProps}
>
	<slot />
</svelte:element>
