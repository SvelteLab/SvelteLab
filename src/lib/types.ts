/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ComponentProps, ComponentType, SvelteComponent } from 'svelte';
import type { KeyBinds } from './command_runner/shortcuts-utilities';

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

export type Command<T extends SvelteComponent = SvelteComponent> = {
	category: 'SvelteLab' | 'Project' | 'Preferences' | 'File';
	title: string;
	subtitle?: string;
	icon?: typeof SvelteComponent<any>;
	command?: string;
	key_bind?: KeyBinds;
	seo?: string;
} & CreateExclusiveUnion<
	| {
			action: () => void;
	  }
	| ({
			action_component: ComponentType<T>;
	  } & (ComponentProps<T> extends { [key: string]: never }
			? object
			: {
					action_component_props: ComponentProps<T>;
			  }))
>;

export type NpmResponse = {
	objects: NpmObject[];
	total: number;
	time: string;
};

export type NpmObject = {
	package: Package;
	score: Score;
	searchScore: number;
};

export type Package = {
	name: string;
	scope: string;
	version: string;
	description: string;
	keywords?: string[];
	date: string;
	links: Links;
	author?: Author;
	publisher: Publisher;
	maintainers: Maintainer[];
};

export type Links = {
	npm: string;
	homepage: string;
	repository: string;
	bugs: string;
};

export type Author = {
	name: string;
	email?: string;
	username?: string;
};

export type Publisher = {
	username: string;
	email: string;
};

export type Maintainer = {
	username: string;
	email: string;
};

export type Score = {
	final: number;
	detail: Detail;
};

export type Detail = {
	quality: number;
	popularity: number;
	maintenance: number;
};
