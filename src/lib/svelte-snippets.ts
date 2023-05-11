import { javascriptLanguage } from '@codemirror/lang-javascript';
import { svelteLanguage } from '@replit/codemirror-lang-svelte';
import { snippetCompletion } from '@codemirror/autocomplete';

export const js_snippets = javascriptLanguage.data.of({
	autocomplete: [
		snippetCompletion(
			`/** @type {import('./$types').RequestHandler} */
export async function \${}(\${}) {
	\${}
	return new Response();
}`,
			{
				label: 'kitEndpoint',
				detail: 'SvelteKit Endpoint',
				boost: 70,
			}
		),
		snippetCompletion(
			`/** @type {import('./$types').Actions} */
export const actions = {
	\${}
};`,
			{
				label: 'kitActions',
				detail: 'SvelteKit Actions',
				boost: 80,
			}
		),
		snippetCompletion(
			`/** @type {import('./$types').\${} */
export async function load(\${}) {
	\${}
}`,
			{
				label: 'kitLoad',
				detail: 'SvelteKit Load',
				boost: 90,
			}
		),
		snippetCompletion(
			`/** @type {import('./$types').Handle */
export async function handle({ event, resolve }) {
	\${}
	const response = await resolve(event);
	return response;
}`,
			{
				label: 'kitHandle',
				detail: 'SvelteKit Handle',
				boost: 40,
			}
		),
		snippetCompletion(
			`/** @type {import('./$types').ParamMatcher */
export function match(param) {
	return \${};
}`,
			{
				label: 'kitParamMatcher',
				detail: 'SvelteKit Param Matcher',
				boost: -50,
			}
		),
		snippetCompletion(
			`export const snapshot = {
		capture: () => {
			\${}
		},
		restore: (value) => {
			\${}
		}
	};`,
			{
				label: 's-snapshots',
				detail: 'add code for the snapshot',
				boost: 40,
			}
		),
	],
});

export const svelte_snippets = svelteLanguage.data.of({
	autocomplete: [
		snippetCompletion(
			`<script>
	\${}
</script>

<!-- your markup here -->
\${}

<style>
	\${}
</style>`,
			{
				label: 's-start',
				detail: 'starting point for a svelte component',
				boost: 100,
			}
		),
		snippetCompletion(
			`{#if \${condition}}
	\${}
{/if}`,
			{
				label: 's-if',
				detail: 'if block',
				boost: 90,
			}
		),
		snippetCompletion(
			`{#if \${condition}}
	\${}
{:else}
	\${}
{/if}`,
			{
				label: 's-if-else',
				detail: 'if else block',
				boost: 85,
			}
		),
		snippetCompletion(
			`<pre>{JSON.stringify(\${data}, null, 2)}</pre>`,
			{
				label: 's-dump',
				detail: 'dump a variable nicely formatted',
				boost: 83,
			}
		),
		snippetCompletion(
			`{#await \${promise}}
	\${}
{/await}`,
			{
				label: 's-await',
				detail: 'await block',
				boost: 20,
			}
		),
		snippetCompletion(
			`{#await \${promise} then \${}}
	\${}
{/await}`,
			{
				label: 's-await-then',
				detail: 'await block without pending state',
				boost: 10,
			}
		),
		snippetCompletion(
			`{#each \${array} as \${item}}
	\${}
{/each}`,
			{
				label: 's-each',
				detail: 'each block',
				boost: 80,
			}
		),
		snippetCompletion(
			`{#each \${array} as \${item}}
	\${}
{:else}
	\${void list...}
{/each}`,
			{
				label: 's-each-else',
				detail: 'each else block',
				boost: 79,
			}
		),
		snippetCompletion(
			`{#each \${array} as \${item},(\${key})}
	\${}
{/each}`,
			{
				label: 's-each-key',
				detail: 'each keyed block',
				boost: 75,
			}
		),
		snippetCompletion(
			`<ul>
{#each \${array} as \${item}(\${key})}
	<li>\${}</li>
{/each}
</ul>`,
			{
				label: 's-each-ul',
				detail: 'each keyed block with ul',
				boost: 78,
			}
		),
		snippetCompletion(
			`{#key \${key}}
	\${}
{/key}`,
			{
				label: 's-key',
				detail: 'key block',
				boost: 30,
			}
		),
	],
});
