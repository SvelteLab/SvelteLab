import type { RequestHandler } from './$types';
import fs from 'fs/promises';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	const dirsFiles = import.meta.glob('../deps/*', { as: 'url' });
	const dirs = Object.keys(dirsFiles).map((file) => file.split('/').at(-1)?.replace('.json', ''));
	return json(dirs);
};
