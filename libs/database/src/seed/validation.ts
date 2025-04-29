import { z } from 'zod';

export const BooleanModelMetadataSchema = z.object({
    id: z.number().int().positive(),
    name: z.string(),
    'url-publication': z.string().url(),
    'url-model': z.union([z.string().url(), z.array(z.string().url()).nonempty()]),
    keywords: z.array(z.string()),
    variables: z.number().int().nonnegative(),
    inputs: z.number().int().nonnegative(),
    regulations: z.number().int().nonnegative(),
    notes: z.string(),
    bib: z.string(),
});

// TypeScript type inferred from the schema
export type BooleanModelMetadata = z.infer<typeof BooleanModelMetadataSchema>;
