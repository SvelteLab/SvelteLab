import { sveltekit } from '@sveltejs/kit/vite';
import { visualizer } from 'rollup-plugin-visualizer';
import { FileSystemIconLoader } from 'unplugin-icons/loaders';
import Icons from 'unplugin-icons/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [
		sveltekit(),
		Icons({
			compiler: 'svelte',
			customCollections: {
				'material-icon-theme': FileSystemIconLoader('./node_modules/material-icon-theme/icons'),
				'r-icons': FileSystemIconLoader('./src/lib/icons/Rinconx64_r-icons')
			}
		}),
		visualizer({
			emitFile: true,
			filename: 'stats.html'
		})
	],
	define: {
		'process.env.NODE_ENV': '"production"'
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
