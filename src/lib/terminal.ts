import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';

export const terminal = new Terminal({
	convertEol: true,
	cursorBlink: true,
	disableStdin: false,
	fontFamily: 'var(--sk-font-mono)',
	lineHeight: 1.6,
});
export const fit_addon = new FitAddon();
terminal.loadAddon(fit_addon);
