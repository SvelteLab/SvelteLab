import { default_project_files } from '$lib/default_project_files';
import { replSchema, type Directory, type Repl } from '$lib/schemas';
import { Resvg } from '@resvg/resvg-js';
import he from 'he';
import type PoketBase from 'pocketbase';
import satori from 'satori';
import { html as toReactNode } from 'satori-html';
import { render } from 'svelte/server';
import type { RequestHandler } from './$types';
import JetBrainsMono from './JetBrainsMono-Regular.ttf';
import OG from './OG.svelte';
import { get_icon_code, load_emoji } from './tweemoji';
import type { FileSystemTree } from '@webcontainer/api';

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
	let files: Repl['files'] = (default_files as Directory).directory;
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
	const result = render(OG, { props: { tree: files as FileSystemTree, name, id, img } });

	const element = toReactNode(
		`${he.decode(result.body, { isAttributeValue: true })}${result.head}`,
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
