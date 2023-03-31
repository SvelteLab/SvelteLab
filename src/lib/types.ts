/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ComponentType, SvelteComponent, SvelteComponentTyped } from 'svelte';
import type { KeyBinds } from '../routes/(repl)/command_runner/shortcuts-utilities';

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

type DistributedKeyOf<T> = T extends any ? keyof T : never;

type CreateExclusiveUnion<T, U = T> = T extends any
	? T & Partial<Record<Exclude<DistributedKeyOf<U>, keyof T>, never>>
	: never;

export type Command = {
	title: string;
	subtitle?: string;
	icon?: typeof SvelteComponent;
	command?: string;
} & CreateExclusiveUnion<
	| {
			key_bind?: KeyBinds;
			action: () => void;
	  }
	| {
			action_component: ComponentType<SvelteComponentTyped<any, { completed: CustomEvent<any> }>>;
	  }
>;
