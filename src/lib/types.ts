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
