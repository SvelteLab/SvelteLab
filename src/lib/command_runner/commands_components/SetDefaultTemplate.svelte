<script lang="ts">
	import { preventDefault } from 'svelte/legacy';
	import { PUBLIC_TEMPLATE_COOKIE_NAME } from '#lib/constants.js';
	import { get_cookie, set_cookie } from '#lib/cookie.js';
	import { page } from '$app/state';
	import { createEventDispatcher } from 'svelte';
	import { fix_title, template_icon_map } from './template_helpers';

	const dispatcher = createEventDispatcher();

	let selected = $state(get_cookie(PUBLIC_TEMPLATE_COOKIE_NAME) || 'basic');
</script>

<form
	onsubmit={preventDefault(() => {
		set_cookie(PUBLIC_TEMPLATE_COOKIE_NAME, selected);
		dispatcher('completed');
	})}
>
	<ul class="action-selection-grid">
		{#each page.data.templates ?? [] as template}
			{@const icons = template_icon_map.get(template)}
			<li>
				<label>
					<input type="radio" value={template} bind:group={selected} />
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
