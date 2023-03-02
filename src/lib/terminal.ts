import { get } from 'svelte/store';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { webcontainer } from './webcontainer';
export const terminal = new Terminal({
	convertEol: true,
	cursorBlink: true,
	disableStdin: false,
	fontFamily: 'var(--sk-font-mono)',
	theme: {
		foreground: 'var(--sk-code-base)',
		background: 'var(--sk-code-bg)'
	}
});
export const fitAddon = new FitAddon();
terminal.loadAddon(fitAddon);

terminal.onKey((e) => {
	const process = get(webcontainer).running_process;
	if (process) {
		if (e.domEvent.ctrlKey && e.domEvent.key.toLowerCase() === 'c') {
			process.kill();
		}
	} else {
		console.log(e.key);
		terminal.write(e.key);
		if (e.key == '\r') terminal.write('\n');
	}
});
