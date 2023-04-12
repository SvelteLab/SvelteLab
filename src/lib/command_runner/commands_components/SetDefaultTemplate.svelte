<script lang="ts">
	import { page } from '$app/stores';
	import { PUBLIC_TEMPLATE_COOKIE_NAME } from '$env/static/public';
	import { get_cookie, set_cookie } from '$lib/cookie';
	import { createEventDispatcher } from 'svelte';
	import { fix_title, template_icon_map } from './template_helpers';

	const dispatcher = createEventDispatcher();

	let selected = get_cookie(PUBLIC_TEMPLATE_COOKIE_NAME) || 'basic';
</script>

<form
	on:submit|preventDefault={() => {
		set_cookie(PUBLIC_TEMPLATE_COOKIE_NAME, selected);
		dispatcher('completed');
	}}
>
	<ul class="action-selection-grid">
		{#each $page.data.templates ?? [] as template}
			{@const icons = template_icon_map.get(template)}
			<li>
				<label>
					<input type="radio" value={template} bind:group={selected} />
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
				</label>
			</li>
		{/each}
	</ul>
	<button class="action-confirm">
		Save {fix_title(selected)} as default
	</button>
</form>

<style>
	form {
		margin: 2rem;
	}

	ul {
		margin-bottom: 1rem;
	}
</style>
