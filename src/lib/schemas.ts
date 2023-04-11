import type { DirectoryNode } from '@webcontainer/api';
import { z } from 'zod';

const uInt8Schema: z.ZodType<Uint8Array> = z.custom<Uint8Array>((val) => {
	return val instanceof Uint8Array;
});

export const file_schema = z.object({
	file: z.object({
		contents: z.union([z.string(), uInt8Schema])
	})
});

export const directory_schema: z.ZodType<DirectoryNode> = z.object({
	directory: z.lazy(() => file_system_schema)
});

export const file_system_schema = z.record(z.union([file_schema, directory_schema]));

const record_schema = z.object({
	id: z.string().optional(),
	expand: z.record(z.string(), z.any()).optional()
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
