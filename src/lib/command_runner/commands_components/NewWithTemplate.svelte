<script lang="ts">
	import { page } from '$app/state';
	import { fix_title, template_icon_map } from './template_helpers';
</script>

<ul class="action-selection-grid">
	{#each page.data.templates ?? [] as template}
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
						{@const SvelteComponent = icons}
						<SvelteComponent />
					{:else}
						{#each icons as icon}
							{@const SvelteComponent_1 = icon}
							<SvelteComponent_1 />
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
