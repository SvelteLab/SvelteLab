/**
 * Copyright (c) 2019-2021 [these people](https://github.com/sveltejs/sites/graphs/contributors)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import flexsearch from 'flexsearch';

export type Block = {
	breadcrumbs: string[];
	href: string;
	content: string;
	rank: number;
};

export type Tree = {
	breadcrumbs: string[];
	href: string;
	node: Block;
	children: Tree[];
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const Index = flexsearch.Index ?? flexsearch;

/** If the search is already initialized */
export let inited = false;

let indexes: (typeof Index)[];

const map = new Map<string, Block>();

const hrefs = new Map<string, string>();

export function init(blocks: Block[]) {
	if (inited) return;

	// we have multiple indexes, so we can rank sections (migration guide comes last)
	const max_rank = Math.max(...blocks.map((block) => block.rank ?? 0));

	indexes = Array.from({ length: max_rank + 1 }, () => new Index({ tokenize: 'forward' }));

	for (const block of blocks) {
		const title = block.breadcrumbs.at(-1);
		map.set(block.href, block);
		// NOTE: we're not using a number as the ID here, but it is recommended:
		// https://github.com/nextapps-de/flexsearch#use-numeric-ids
		// If we were to switch to a number we would need a second map from ID to block
		// We need to keep the existing one to allow looking up recent searches by URL even if docs change
		// It's unclear how much browsers do string interning and how this might affect memory
		// We'd probably want to test both implementations across browsers if memory usage becomes an issue
		// TODO: fix the type by updating flexsearch after
		// https://github.com/nextapps-de/flexsearch/pull/364 is merged and released
		indexes[block.rank ?? 0].add(block.href, `${title} ${block.content}`);

		hrefs.set(block.breadcrumbs.join('::'), block.href);
	}

	inited = true;
}

/**
 * Search for a given query in the existing index
 * @param {string} query
 * @returns {Tree[]}
 */
export function search(query: string) {
	const escaped = query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
	const regex = new RegExp(`(^|\\b)${escaped}`, 'i');

	const blocks = indexes
		.flatMap((index) => index.search(query))
		.map(lookup)
		.map((block, rank) => ({ block: block, rank }))
		.sort((a, b) => {
			const a_title_matches = regex.test(a.block?.breadcrumbs.at(-1) ?? '');
			const b_title_matches = regex.test(b.block?.breadcrumbs.at(-1) ?? '');

			// massage the order a bit, so that title matches
			// are given higher priority
			if (a_title_matches !== b_title_matches) {
				return a_title_matches ? -1 : 1;
			}

			return (
				(a.block?.breadcrumbs.length ?? 0 - (b.block?.breadcrumbs.length ?? 0)) || a.rank - b.rank
			);
		})
		.map(({ block }) => block) as Block[];

	const results = tree([], blocks).children;

	return results;
}

/**
 * Get a block with details by its href
 * @param {string} href
 */
export function lookup(href: string) {
	return map.get(href);
}

function tree(breadcrumbs: string[], blocks: Block[]): Tree {
	const depth = breadcrumbs.length;

	const node = blocks.find((block) => {
		if (block.breadcrumbs.length !== depth) return false;
		return breadcrumbs.every((part, i) => block.breadcrumbs[i] === part);
	});

	const descendants = blocks.filter((block) => {
		if (block.breadcrumbs.length <= depth) return false;
		return breadcrumbs.every((part, i) => block.breadcrumbs[i] === part);
	});

	const child_parts = Array.from(new Set(descendants.map((block) => block.breadcrumbs[depth])));

	return {
		breadcrumbs,
		href: hrefs.get(breadcrumbs.join('::')) ?? '',
		node: node as Block,
		children: child_parts.map((part) => tree([...breadcrumbs, part], descendants)),
	};
}
