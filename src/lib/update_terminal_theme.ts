import type { Theme } from './theme';

export async function update_terminal_theme(theme: Theme, update_terminal = true) {
	if (!update_terminal) return;
	const { terminal } = await import('./terminal');
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const { sk_code_bg, sk_code_fg } = variables_mapping.get(theme)!;
	terminal.options.theme = {
		...terminal.options.theme,
		background: sk_code_bg,
		foreground: sk_code_fg
	};
}

/**
 * Those are the values of the css variables, we need to store them as plain rgb becuase
 * xtermjs validates that the string is an rgb.
 */
const variables_mapping = new Map<Theme, { sk_code_bg: string; sk_code_fg: string }>([
	[
		'light',
		{
			sk_code_bg: '#f7fafd',
			sk_code_fg: '#5f5c53'
		}
	],
	[
		'dark',
		{
			sk_code_bg: '#1a1a1a',
			sk_code_fg: '#c4c1bb'
		}
	]
]);
