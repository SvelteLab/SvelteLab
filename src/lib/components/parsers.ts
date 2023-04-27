export const UINT8KIND = 'sveltelab-ui8a';

export function parse(to_parse: string) {
	return JSON.parse(to_parse, (_key, value) => {
		if (value.kind === UINT8KIND) {
			return new Uint8Array(value.buffer);
		}
		return value;
	});
}

export function stringify(to_parse: unknown) {
	return JSON.stringify(to_parse, (_key, value) => {
		if (value instanceof Uint8Array) {
			return {
				kind: UINT8KIND,
				buffer: Array.from(value),
			};
		}
		return value;
	});
}
