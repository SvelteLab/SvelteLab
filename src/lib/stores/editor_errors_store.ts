import { get, writable } from 'svelte/store';

export type Diagnostic = {
	type: 'error' | 'warning';
	filename: string;
	start: {
		line: number;
		character: number;
	};
	end: {
		line: number;
		character: number;
	};
	message: string;
	code: string;
	source: string;
};

export function assert_diagnostic(
	diagnostic_wannabe: unknown
): asserts diagnostic_wannabe is Diagnostic {
	function assert_object(object_wannabe: unknown, name = ''): asserts object_wannabe is object {
		if (typeof object_wannabe !== 'object' || object_wannabe == null) {
			throw new Error(`${name} is not an object`);
		}
	}
	assert_object(diagnostic_wannabe);
	if (
		!('type' in diagnostic_wannabe) ||
		typeof diagnostic_wannabe.type !== 'string' ||
		!['error', 'warning'].includes(diagnostic_wannabe.type)
	) {
		throw new Error("Property type in this diagnostic is neither 'warning' or 'error'");
	}
	if (!('start' in diagnostic_wannabe)) throw new Error('Missing start property');
	if (!('end' in diagnostic_wannabe)) throw new Error('Missing end property');
	if (!('filename' in diagnostic_wannabe)) throw new Error('Missing filename property');
	if (!('message' in diagnostic_wannabe)) throw new Error('Missing message property');

	assert_object(diagnostic_wannabe.start);
	assert_object(diagnostic_wannabe.end);

	if (!('line' in diagnostic_wannabe.start)) throw new Error('Missing start.line property');
	if (!('character' in diagnostic_wannabe.start))
		throw new Error('Missing start.character property');
	if (!('line' in diagnostic_wannabe.end)) throw new Error('Missing end.line property');
	if (!('character' in diagnostic_wannabe.end)) throw new Error('Missing end.character property');

	if (typeof diagnostic_wannabe.end.character !== 'number')
		throw new Error('end.character is not a number');
	if (typeof diagnostic_wannabe.start.character !== 'number')
		throw new Error('start.character is not a number');
	if (typeof diagnostic_wannabe.end.line !== 'number') throw new Error('end.line is not a number');
	if (typeof diagnostic_wannabe.start.line !== 'number')
		throw new Error('start.line is not a number');

	if (typeof diagnostic_wannabe.filename !== 'string') throw new Error('filename is not a string');
	if (typeof diagnostic_wannabe.message !== 'string') throw new Error('message is not a string');
}

const { subscribe, update } = writable(new Map<string, Set<Diagnostic>>());

const diagnostic_resolves = new Map<string, (result: Set<Diagnostic>) => void>();

export let is_sveltecheck_running = false;

let resolved = false;

const VOID_SET = new Set<Diagnostic>();

export const diagnostic_store = {
	subscribe,
	clear() {
		update(($diagnostics) => {
			$diagnostics.clear();
			return $diagnostics;
		});
	},
	clear_route(route: string) {
		update(($diagnostics) => {
			$diagnostics.get(route)?.clear();
			return $diagnostics;
		});
	},
	push_diagnositc(diagnostic: Diagnostic) {
		update(($diagnostics) => {
			if (!$diagnostics.has(diagnostic.filename)) {
				$diagnostics.set(diagnostic.filename, new Set());
			}
			$diagnostics.get(diagnostic.filename)?.add(diagnostic);
			return $diagnostics;
		});
	},
	set_is_running(is_running: boolean) {
		is_sveltecheck_running = is_running;
	},
	async get_diagnostic(path: string) {
		// if sveltecheck is not running just return an empty array
		if (!is_sveltecheck_running) return [];
		// if the promise was already resolved the map will be empty
		// so we return the value from the store
		if (resolved) {
			return get({ subscribe }).get(path);
		}
		// otherwise create a new Promise, store the resolve and return the promise
		const diagnositc_promise = new Promise<Set<Diagnostic>>((resolve) => {
			diagnostic_resolves.set(path, resolve);
		});
		return diagnositc_promise;
	},
	resolve() {
		diagnostic_resolves.forEach((resolve, path) => {
			resolve(get({ subscribe }).get(path) ?? VOID_SET);
		});
		diagnostic_resolves.clear();
		resolved = true;
	},
	prepare_for_new_check() {
		resolved = false;
		this.clear();
	},
};
