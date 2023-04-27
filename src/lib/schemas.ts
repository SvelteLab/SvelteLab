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

export const fileSchema = z.object({
	file: z.object({
		contents: z.union([z.string(), parsed_uint8_schema]),
	}),
});

export const directorySchema: z.ZodType<ParsedDirectory> = z.object({
	directory: z.lazy(() => fileSystemSchema),
});

export const fileSystemSchema = z.record(z.union([fileSchema, directorySchema]));

export const replSchema = z.object({
	name: z.string().min(2),
	id: z.string().optional(),
	files: fileSystemSchema,
	user: z.string(),
	expand: z.record(z.string(), z.any()).optional(),
});
