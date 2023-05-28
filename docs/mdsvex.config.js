import { defineMDSveXConfig as defineConfig } from 'mdsvex';
import slug from 'remark-slug';
import autolink from 'remark-autolink-headings';

function get_headings() {
	let visit;
	let tree_to_string;
	return async function transformer(tree, vFile) {
		if (!visit) {
			tree_to_string = (await import('mdast-util-to-string')).toString;
			visit = (await import('unist-util-visit')).visit;
		}
		vFile.data.headings = [];

		visit(tree, 'heading', (node) => {
			vFile.data.headings.push({
				level: node.depth,
				title: tree_to_string(node),
				url: node.children[0].url
			});
		});

		if (!vFile.data.fm) vFile.data.fm = {};
		vFile.data.fm.headings = vFile.data.headings;
	};
}

const config = defineConfig({
	extensions: ['.svelte.md', '.md', '.svx'],

	smartypants: {
		dashes: 'oldschool'
	},

	remarkPlugins: [
		slug,
		[
			autolink,
			{
				linkProperties: {
					class: 'autolink-header'
				},
				content: [
					{
						type: 'element',
						tagName: 'span',
						properties: {},
						children: [{ type: 'text', value: '#' }]
					}
				]
			}
		],
		get_headings
	]
});

export default config;
