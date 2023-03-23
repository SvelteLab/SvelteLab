import type { SvelteComponentTyped } from 'svelte';

export type SvelteError = {
	name: string;
	code: string;
	start: {
		line: number;
		column: number;
		character: number;
	};
	end: {
		line: number;
		column: number;
		character: number;
	};
	pos: number;
	frame: string;
} & Error;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DistributedKeyOf<T> = T extends any ? keyof T : never;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CreateExclusiveUnion<T, U = T> = T extends any
	? T & Partial<Record<Exclude<DistributedKeyOf<U>, keyof T>, never>>
	: never;

export type Command = {
	title: string;
	subtitle?: string;
	command?: string;
} & CreateExclusiveUnion<
	| {
			action: () => void;
	  }
	| {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			action_component: new (...args: any[]) => SvelteComponentTyped<
				any,
				{ completed: CustomEvent<unknown> }
			>;
	  }
>;
