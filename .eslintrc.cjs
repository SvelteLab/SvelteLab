module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier','plugin:svelte/recommended'],
	plugins: ['@typescript-eslint'],
	ignorePatterns: ['*.cjs'],
	overrides: [{ files: ['*.svelte'], processor: 'svelte3/svelte3' }],
	settings: {
		'svelte3/typescript': () => require('typescript'),
	},
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
		extraFileExtension: ['.svelte']
	},
	env: {
		browser: true,
		es2017: true,
		node: true,
	},
	overrides: [
		{
		  files: ['*.svelte'],
		  parser: 'svelte-eslint-parser',
		  parserOptions: {
			parser: '@typescript-eslint/parser'
		  }
		}
	  ],
	rules: {
		'@typescript-eslint/naming-convention': [
			'error',
			{
				selector: ['variableLike'],
				format: ['snake_case', 'UPPER_CASE'],
				leadingUnderscore: 'allow',
			},
		],
	},
};
