import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { plugin as mdPlugin, Mode } from 'vite-plugin-markdown';

export default defineConfig({
	plugins: [sveltekit(), mdPlugin({ mode: [Mode.HTML] })],
	server: {
		fs: {
			allow: ['..']
		}
	}
});
