<script lang="ts">
	import { page } from '$app/stores';
	import { fix_title, template_icon_map } from './template_helpers';
</script>

<ul class="action-selection-grid">
	{#each $page.data.templates ?? [] as template}
		{@const icons = template_icon_map.get(template)}
		<li>
			<a
				class="action-confirm"
				title="Open {template}"
				href="./?t={template}"
				target="_blank"
				rel="noopener noreferrer"
			>
				{#if icons}
					{#if !Array.isArray(icons)}
						<svelte:component this={icons} />
					{:else}
						{#each icons as icon}
							<svelte:component this={icon} />
						{/each}
					{/if}
				{/if}
				{fix_title(template)}
			</a>
		</li>
	{/each}
</ul>

<style>
	ul.action-selection-grid {
		padding: 2rem;
	}
</style>
