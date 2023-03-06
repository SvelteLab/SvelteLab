export const package_json = JSON.stringify({
	name: 'kit-template-default',
	version: '0.0.1',
	scripts: {
		dev: 'vite dev',
		build: 'vite build',
		preview: 'vite preview',
		check: 'svelte-kit sync && svelte-check --tsconfig ./jsconfig.json',
		'check:watch':
			'svelte-kit sync && svelte-check --tsconfig ./jsconfig.json --watch',
	},
	devDependencies: {
		'@sveltejs/adapter-auto': '^2.0.0',
		'@sveltejs/kit': '^1.5.0',
		'@types/cookie': '^0.5.1',
		svelte: '^3.54.0',
		'svelte-check': '^3.0.1',
		typescript: '^4.9.3',
		vite: '^4.0.0',
	},
	type: 'module',
}, null, 2);