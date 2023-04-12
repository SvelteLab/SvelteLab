import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

export const terminal = new Terminal({
	convertEol: true,
	cursorBlink: true,
	disableStdin: false,
	fontFamily: 'var(--sk-font-mono)',
});
export const fitAddon = new FitAddon();
terminal.loadAddon(fitAddon);
