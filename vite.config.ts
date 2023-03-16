import { sveltekit } from '@sveltejs/kit/vite';
import { FileSystemIconLoader } from 'unplugin-icons/loaders';
import Icons from 'unplugin-icons/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [
		sveltekit(),
		Icons({
			compiler: 'svelte',
			customCollections: {
				'vscode-material-icon-theme': FileSystemIconLoader(
					'./src/icons/vscode-material-icon-theme',
					(svg) => svg.replace(/^<svg /, '<svg fill="currentColor" ')
				)
			}
		})
	],
	define: {
		'process.env.NODE_ENV': '"production"'
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
