<script lang="ts">
	interface Props {
		file: string;
		children?: import('svelte').Snippet;
	}

	let { file, children }: Props = $props();
</script>

{#if file}
	<section data-markdown={file}></section>
{:else}
	<section data-markdown>
		<div data-template>
			{@render children?.()}
		</div>
	</section>
{/if}
