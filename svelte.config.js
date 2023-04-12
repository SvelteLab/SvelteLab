import adapter from '@sveltejs/adapter-vercel';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: adapter({
			runtime: 'edge'
		})
	},
	vitePlugin: {
		experimental: {
			inspector: {
				holdMode: true,
				toggleKeyCombo: 'control-shift'
			}
		}
	}
};

export default config;
