import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import JetBrainsMono from './JetBrainsMono-Regular.ttf';
import { html as toReactNode } from 'satori-html';
import OG from './OG.svelte';
import { replSchema } from '$lib/schemas';
import type PoketBase from 'pocketbase';
import { default_project_files } from '$lib/default_project_files';
import type { RequestHandler } from './$types';
import type { DirectoryNode, FileSystemTree } from '@webcontainer/api';
import he from 'he';
import { get_icon_code, load_emoji } from './tweemoji';
import { render } from 'svelte/server';

const height = 630;
const width = 1200;

export const config = {
	runtime: 'nodejs20.x',
};

async function get_repl_from_id(id: string, pocketbase: PoketBase) {
	const record = await pocketbase.collection('repls').getOne(id, {
		expand: 'user',
	});
	return replSchema.parse(record);
}

export const GET: RequestHandler = async ({ url, locals }) => {
	const repl_id = url.searchParams.get('repl_id');
	const template = url.searchParams.get('t') ?? 'basic';
	const default_files = default_project_files[template] ?? default_project_files['basic'];
	let files: FileSystemTree = (default_files as DirectoryNode).directory;
	let name = 'Hello SvelteLab!';
	let id;
	let img = `${url.origin}/icon192.png`;
	if (repl_id) {
		const record = await get_repl_from_id(repl_id, locals.pocketbase);
		if (record) {
			files = record.files;
			name = record.name;
			id = record.id;
			img = record.expand?.user.avatarUrl;
		}
	}
	const result = render(OG, { props: { tree: files, name, id, img }});

	const element = toReactNode(
		`${he.decode(result.html, { isAttributeValue: true })}`,
	);
	const svg = await satori(element, {
		fonts: [
			{
				name: 'JetBrains Mono',
				data: Buffer.from(JetBrainsMono),
				style: 'normal',
			},
		],
		height,
		width,
		async loadAdditionalAsset(code, segment) {
			if (code === 'emoji' && segment) {
				return `data:image/svg+xml;base64,` + btoa(await load_emoji(get_icon_code(segment)));
			}
			return '';
		},
	});

	const resvg = new Resvg(svg, {
		fitTo: {
			mode: 'width',
			value: width,
		},
	});

	const image = resvg.render();

	return new Response(image.asPng(), {
		headers: {
			'content-type': 'image/png',
		},
	});
};
