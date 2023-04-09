/* eslint-disable no-undef */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { compile as svelte_compile } from 'svelte/compiler';
import { transpile } from 'typescript';
import MagicString from 'magic-string';
import { originalPositionFor, TraceMap } from '@jridgewell/trace-mapping';

self.window = self; // egregious hack to get magic-string to work in a worker

self.addEventListener('message', async (event) => {
	switch (event.data.type) {
		case 'compile':
			try {
				postMessage(compile(event.data));
			} catch (e) {
				/*empty*/
			}
			break;
	}
});

const common_options = {
	dev: false,
	css: true
};

function get_character_from_pos(line, column, source) {
	const lines = source.split('\n');
	let sum = column;
	for (let i = 0; i < line - 1; i++) {
		sum += lines.shift().length + 1;
	}
	return sum;
}

function compile({ id, source, options, return_ast }) {
	let trace_map;
	try {
		const matches = source.match(/<script\s+lang=(?:"ts"|'ts'|`ts`)>(?<code>[\s\S]*)<\/script>/m);
		let new_source = source;
		if (matches && matches.groups) {
			const transpiled = transpile(matches.groups.code, {
				target: 'es6',
				preserveValueImports: true
			});
			const magic_code = new MagicString(source);
			const start = matches.index + matches[0].indexOf('>') + 1;
			const end = start + matches.groups.code.length;
			magic_code.update(start, end, transpiled);
			new_source = magic_code.toString();
			let source_map = magic_code.generateMap({
				hires: true,
				includeContent: true
			});
			trace_map = new TraceMap(source_map);
		}
		const { warnings, ast } = svelte_compile(
			new_source,
			Object.assign({}, common_options, options)
		);
		for (let warning of warnings) {
			delete warning.toString;
			if (trace_map) {
				const new_start = originalPositionFor(trace_map, {
					column: warning.start.column,
					line: warning.start.line
				});
				const new_end = originalPositionFor(trace_map, {
					column: warning.end.column,
					line: warning.end.line
				});
				warning.start.column = new_start.column;
				warning.start.line = new_start.line;
				warning.start.character = get_character_from_pos(new_start.line, new_start.column, source);
				warning.end.column = new_end.column;
				warning.end.line = new_end.line;
				warning.end.character = get_character_from_pos(new_end.line, new_end.column, source);
			}
		}
		return {
			id,
			result: {
				ast: return_ast ? ast : null,
				warnings
			}
		};
	} catch (e) {
		if (trace_map) {
			if (e.start) {
				const new_start = originalPositionFor(trace_map, {
					column: e.start.column,
					line: e.start.line
				});
				e.start.column = new_start.column;
				e.start.line = new_start.line;
				e.start.character = get_character_from_pos(new_start.line, new_start.column, source);
			}
			if (e.end) {
				const new_end = originalPositionFor(trace_map, {
					column: e.end.column,
					line: e.end.line
				});
				e.end.column = new_end.column;
				e.end.line = new_end.line;
				e.end.character = get_character_from_pos(new_end.line, new_end.column, source);
			}
		}
		return {
			id,
			result: {
				error: {
					message: e.message,
					name: e.name,
					code: e.code,
					start: e.start,
					end: e.end,
					pos: e.pos,
					frame: e.frame
				}
			}
		};
	}
}
