import { get } from 'svelte/store';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { webcontainer } from './webcontainer';
export const terminal = new Terminal({
	convertEol: true,
	cursorBlink: true,
	disableStdin: false,
	fontFamily: 'var(--sk-font-mono)'
});
export const fitAddon = new FitAddon();
terminal.loadAddon(fitAddon);

const lines: string[] = [''];
//we need to keep track of the line and the caret ourself
let current_caret = 1;
let line_history = 1;

terminal.onKey((e) => {
	const process = get(webcontainer).running_process;
	const key_event = e.domEvent.key.toLowerCase();
	const printable = !e.domEvent.altKey && !e.domEvent.ctrlKey && !e.domEvent.metaKey;
	//store unicode char for ESC
	const ESC = '\x1B';
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const line = lines[lines.length - line_history]!;
	if (process) {
		if (e.domEvent.ctrlKey && key_event === 'c') {
			process.kill();
		}
	} else {
		let to_write = e.key;
		// needed to avoid parsing error on backspace
		if (key_event === 'backspace') {
			//on backspace lower the caret if it's greater than 1
			if (current_caret > 1) {
				current_caret--;
			}
			//split the string based on the caret position
			const first = line.substring(0, current_caret - 1);
			const last = line.substring(current_caret);
			console.log(first, last);
			/**
			 * This madness write in the buffer of xterm in this way
			 * - \b move the caret back
			 * - ESC[K delete the line from the caret to the end of line
			 * - last is written to the buffer
			 * - ESC[{first.length+1}G moves the caret back to the correct column
			 */
			to_write = `\b${ESC}[K${last}${ESC}[${first.length + 1}G`;
			//than we join first and last together again
			lines[lines.length - line_history] = first + last + '';
		}
		if (key_event === 'arrowdown') {
			// by default on arrow down we do nothing
			to_write = '';
			if (lines.length - line_history < lines.length - 1) {
				//if there's history we move down the history
				line_history--;
				/**
				 * ESC[2K deletes the entire line
				 * ESC[0G move the cursor to 0
				 * we write the new line
				 * than we reset the cursor
				 */
				to_write = `${ESC}[2K${ESC}[0G${lines[lines.length - line_history]}`;
				current_caret = lines[lines.length - line_history].length + 1;
			}
		}
		if (key_event === 'arrowup') {
			// by default on arrow up we do nothing
			to_write = '';
			if (lines.length - line_history > 0) {
				//if there's history we move up the history
				line_history++;
				/**
				 * ESC[2K deletes the entire line
				 * ESC[0G move the cursor to 0
				 * we write the new line
				 * than we reset the cursor
				 */
				to_write = `${ESC}[2K${ESC}[0G${lines[lines.length - line_history]}`;
				current_caret = lines[lines.length - line_history].length + 1;
			}
		}
		if (key_event === 'arrowleft') {
			if (current_caret > 1) {
				current_caret--;
			}
		}
		if (key_event === 'arrowright') {
			if (current_caret <= line.length) {
				current_caret++;
			} else {
				to_write = '';
			}
		}
		if (key_event.length === 1 && printable) {
			// to insert a letter (if the key of the pressed element is 1 and it's printable)
			// we split the line to the current caret
			const first = line.substring(0, current_caret - 1);
			const last = line.substring(current_caret - 1);
			//we combine the first, last and key event
			lines[lines.length - line_history] = `${first}${key_event}${last}`;
			/**
			 * ESC[K deletes the line from the current position to the end
			 * we write e.key
			 * we write last again
			 * we move to the correct column
			 */
			to_write = `${ESC}[K${e.key}${last}${ESC}[${first.length + 2}G`;
			current_caret++;
		}
		terminal.write(to_write);
		if (e.key == '\r') {
			//if it's an enter we run the command
			webcontainer.run_command(line);
			//we push a new line
			lines.push('');
			//reset history and caret
			line_history = 1;
			current_caret = 1;
			//write newline
			terminal.write('\n');
		}
	}
});
