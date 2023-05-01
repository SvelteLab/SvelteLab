import { parse } from '$lib/components/parsers';
import type { FileSystemTree } from '@webcontainer/api';
import type { LayoutLoad, LayoutServerData } from './$types';

type FixData<T extends object> = {
	[Key in keyof T]: Key extends 'repl' ? FileSystemTree | undefined : T[Key];
};

function get_correct_repl(repl: string | FileSystemTree | undefined) {
	if (typeof repl === 'string') {
		// we can cast here because we already parse with zod in the
		// server function, we use the custom parse function to transform
		// every Uint8Array stored in a real Uint8Array
		return parse(repl) as FileSystemTree;
	}
	return repl;
}

export const load: LayoutLoad = async ({ data }) => {
	const { repl, ...rest_of_data } = data;
	const retval: FixData<LayoutServerData> = {
		...rest_of_data,
		repl: get_correct_repl(repl),
	};
	return retval;
};
