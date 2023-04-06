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

const height = 630;
const width = 1200;

export const config = {
	runtime: 'nodejs18.x'
};

async function get_repl_from_id(id: string, pocketbase: PoketBase) {
	const record = await pocketbase.collection('repls').getOne(id, {
		expand: 'user'
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

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const result = (OG as any).render({ tree: files, name, id, img });
	const element = toReactNode(`${result.html}<style>${result.css.code}</style>`);
	const svg = await satori(element, {
		fonts: [
			{
				name: 'JetBrains Mono',
				data: Buffer.from(JetBrainsMono),
				style: 'normal'
			}
		],
		height,
		width
	});

	const resvg = new Resvg(svg, {
		fitTo: {
			mode: 'width',
			value: width
		}
	});

	const image = resvg.render();

	return new Response(image.asPng(), {
		headers: {
			'content-type': 'image/png'
		}
	});
};
