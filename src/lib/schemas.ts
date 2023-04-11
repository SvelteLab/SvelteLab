import { z } from 'zod';
import { UINT8KIND } from './components/parsers';

type ParsedFile = {
	file: {
		contents:
			| {
					kind: typeof UINT8KIND;
					buffer: number[];
			  }
			| string;
	};
};

type ParsedDirectory = {
	directory: ParsedFileSystem;
};

type ParsedFileSystem = {
	[key: string]: ParsedDirectory | ParsedFile;
};

const parsed_uint8_schema = z.object({
	kind: z.literal(UINT8KIND),
	buffer: z.array(z.number()),
});

export const file_schema = z.object({
	file: z.object({
		contents: z.union([z.string(), parsed_uint8_schema]),
	}),
});

export const directory_schema: z.ZodType<ParsedDirectory> = z.object({
	directory: z.lazy(() => file_system_schema),
});

export const file_system_schema = z.record(z.union([file_schema, directory_schema]));

const record_schema = z.object({
	id: z.string().optional(),
	files: file_system_schema,
	user: z.string(),
	expand: z.record(z.string(), z.any()).optional(),
});

export const repl_schema = record_schema.extend({
	name: z.string().min(2),
	files: file_system_schema,
	user: z.string(),
	category: z.string()
});

export const categorized_repl_schema = record_schema.extend({
	category: z.string(),
	user: z.string(),
	name: z.string()
});

export type CategorizedRepl = z.infer<typeof categorized_repl_schema>;

export const categorized_repls_schema = z.array(categorized_repl_schema);
