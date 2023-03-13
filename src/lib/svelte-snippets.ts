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
				boost: 70
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
				boost: 80
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
				boost: 90
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
				boost: -50
			}
		)
	]
});

export const svelte_snippets = svelteLanguage.data.of({
	autocomplete: [
		snippetCompletion(
			`{#if \${condition}}
	\${}
{/if}`,
			{
				label: 's-if',
				detail: 'if block',
				boost: 90
			}
		),
		snippetCompletion(
			`{#await \${promise}}
	\${}
{/await}`,
			{
				label: 's-await',
				detail: 'await block',
				boost: 20
			}
		),
		snippetCompletion(
			`{#await \${promise} then \${}}
	\${}
{/await}`,
			{
				label: 's-await-then',
				detail: 'await block without pending state',
				boost: 10
			}
		),
		snippetCompletion(
			`{#each \${array} as \${item}}
	\${}
{/each}`,
			{
				label: 's-each',
				detail: 'each block',
				boost: 80
			}
		),
		snippetCompletion(
			`{#key \${key}}
	\${}
{/key}`,
			{
				label: 's-key',
				detail: 'key block',
				boost: 30
			}
		)
	]
});
