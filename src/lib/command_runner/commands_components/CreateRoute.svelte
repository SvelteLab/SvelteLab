<script lang="ts">
	import { get_file_icon } from '$lib/file_icons';
	import { is_dir } from '$lib/file_system';
	import { files, webcontainer } from '$lib/webcontainer';
	import type { FileSystemTree } from '@webcontainer/api';
	import { createEventDispatcher, tick } from 'svelte';
	import TS from '~icons/vscode-icons/file-type-typescript-official';

	const dispatch = createEventDispatcher();

	let route = '/';
	let old_to_add = null as null | string;
	let input: HTMLInputElement;
	let is_ts = false;

	const creatable_file = {
		'+page.svelte': {
			js:
				`<script>
	export let data: PageData;
</scri` +
				`pt>
`,
			ts:
				`<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</scri` +
				`pt>
`,
		},
		'+page': {
			js: `
export const load = (async () => {
	return {};
});
`,
			ts: `import type { PageLoad } from './$types';

export const load = (async () => {
	return {};
}) satisfies PageLoad;
`,
		},
		'+page.server': {
			js: `export const load = (async () => {
	return {};
});
`,
			ts: `import type { PageServerLoad } from './$types';

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;
`,
		},
		'+layout.svelte': {
			js:
				`<script>
	export let data;
</scri` +
				`pt>

<slot />
`,
			ts:
				`<script lang="ts">
	import type { LayoutData } from './$types';

	export let data: LayoutData;
</scri` +
				`pt>

<slot />
`,
		},
		'+layout': {
			js: `export const load = (async () => {
	return {};
});
`,
			ts: `import type { LayoutLoad } from './$types';

export const load = (async () => {
	return {};
}) satisfies LayoutLoad;
`,
		},
		'+layout.server': {
			js: `export const load = (async () => {
	return {};
});
`,
			ts: `import type { LayoutServerLoad } from './$types';

export const load = (async () => {
	return {};
}) satisfies LayoutServerLoad;
`,
		},
		'+server': {
			js: `export const GET = async () => {
	return new Response();
};
`,
			ts: `import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	return new Response();
};
`,
		},
		'+error.svelte': {
			js:
				`<script>
	import { page } from '$app/stores';
</scri` +
				`pt>

<h1>{$page.status}: {$page.error?.message}</h1>
`,
			ts:
				`<script lang="ts">
	import { page } from '$app/stores';
</scri` +
				`pt>

<h1>{$page.status}: {$page.error?.message}</h1>
`,
		},
	};

	let files_to_create = ['+page.svelte'] as string[];

	let autocomplete =
		is_dir($files.src) && is_dir($files.src.directory.routes)
			? autocomplete_from_tree($files.src.directory.routes.directory)
			: [];

	function get_creatable_file_content(file: string) {
		let content = '';
		if (file in creatable_file) {
			content = creatable_file[file as keyof typeof creatable_file][is_ts ? 'ts' : 'js'];
		}
		return content;
	}

	function autocomplete_from_tree(tree: FileSystemTree, path = '/') {
		let return_value = [] as string[];
		for (let file in tree) {
			const current_file = tree[file];
			if (is_dir(current_file)) {
				return_value.push(path + file);
				return_value.push(...autocomplete_from_tree(current_file.directory, path + file + '/'));
			}
		}
		return return_value;
	}

	$: {
		tick().then(() => {
			if (old_to_add && route.length <= old_to_add.length) return;
			let suggestion = autocomplete.find((ac) => ac.startsWith(route));
			if (suggestion && route) {
				suggestion = suggestion.replace(route, '');
				input.setRangeText(suggestion);
				input.setSelectionRange(route.length, route.length + suggestion.length);
			}
		});
	}
</script>

<form
	on:submit|preventDefault={async (e) => {
		const path = `src/routes/${route}`.split('/').filter(Boolean);
		let prefix = '/';
		for (const dir of path) {
			await webcontainer.add_folder(prefix + dir);
			prefix = prefix + dir + '/';
		}
		for (let file of files_to_create) {
			let suffix = '';
			if (!file.endsWith('.svelte')) {
				suffix = is_ts ? '.ts' : '.js';
			}
			await webcontainer.add_file(prefix + file + suffix, get_creatable_file_content(file));
		}
		dispatch('completed');
	}}
>
	<label>
		Route
		<!-- svelte-ignore a11y-autofocus -->
		<input
			class="action-field"
			type="text"
			autofocus
			on:keydown={(e) => {
				if (e.key === 'Tab' && input.selectionStart !== input.selectionEnd) {
					e.preventDefault();
					e.stopPropagation();
					input.setSelectionRange(input.value.length, input.value.length);
					route = input.value;
				}
			}}
			bind:this={input}
			value={route}
			on:input={(e) => {
				old_to_add = route;
				route = e.currentTarget.value;
			}}
			placeholder="insert route to create"
		/>
	</label>

	<section>
		<ul class="action-selection-grid">
			{#each Object.keys(creatable_file) as file_to_create}
				{@const label = file_to_create.endsWith('.svelte')
					? file_to_create
					: `${file_to_create}${is_ts ? '.ts' : '.js'}`}
				{@const icon = get_file_icon(label)}
				<li>
					<label>
						<input value={file_to_create} type="checkbox" bind:group={files_to_create} />
						<svelte:component this={icon} />
						{label}
					</label>
				</li>
			{/each}
			<li>
				<label>
					<input type="checkbox" bind:checked={is_ts} />
					<TS />
					Use TypeScript
				</label>
			</li>
		</ul>
	</section>
	<button disabled={files_to_create.length === 0} class="action-confirm">
		{#if files_to_create.length > 0}
			Create "{route}" route
		{:else}
			Select some files
		{/if}
	</button>
</form>

<style>
	form {
		display: grid;
		gap: 2rem;
		margin: 2rem;
	}
	button:hover {
		background-color: var(--sk-back-4);
	}
</style>
