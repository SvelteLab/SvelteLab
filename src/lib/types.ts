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

export type Command = {
	command?: string;
	title: string;
	subtitle?: string;
	action: (...args: string[]) => void;
};
