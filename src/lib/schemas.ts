import type { DirectoryNode } from '@webcontainer/api';
import { z } from 'zod';

const uInt8Schema: z.ZodType<Uint8Array> = z.custom<Uint8Array>((val) => {
	return val instanceof Uint8Array;
});

export const fileSchema = z.object({
	file: z.object({
		contents: z.union([z.string(), uInt8Schema])
	})
});

export const directorySchema: z.ZodType<DirectoryNode> = z.object({
	directory: z.lazy(() => fileSystemSchema),
});

export const fileSystemSchema = z.record(z.union([fileSchema, directorySchema]));

export const replSchema = z.object({
	name: z.string().min(2),
	id: z.string().optional(),
	files: fileSystemSchema,
	user: z.string()
});
