import type { Response } from 'express';
import { z, ZodError } from 'zod';
import { NonexistentRecordError } from '../repositories/types/errors';
export const handleErrors = (e: unknown, res: Response) => {
    if (e instanceof ZodError) {
        const zodErrorResponse = {
            status: 'Failure',
            data: {},
            error: 'Invalid request input',
        };
        return res.status(400).send(zodErrorResponse);
    }
    if (e instanceof NonexistentRecordError) {
        const nonExistentRecordErrorResponse = {
            status: 'Failure',
            data: {},
            error: 'Non existent or deleted model',
        };
        return res.status(404).send(nonExistentRecordErrorResponse);
    }
    const serverFailResponse = {
        status: 'Failure',
        data: {},
        //error: 'Server side error',
        error: e instanceof Error ? e.message : String(e),
    };
    return res.status(500).send(serverFailResponse);
};

export const validateId = z.object({
    id: z.string().uuid(),
});

export const validateModelCreateBody = z.object({
    name: z.string(),
    urlPublication: z.string(),
    urlModel: z.string(),
    keywords: z.array(z.string()),
    variables: z.number(),
    inputs: z.number(),
    regulations: z.number(),
    notes: z.string(),
    bib: z.string(),
    modelData: z.instanceof(Buffer),
});

export const validateModelUpdateBody = z
    .object({
        name: z.string().optional(),
        urlPublication: z.string().url().optional(),
        urlModel: z.string().url().optional(),
        keywords: z.array(z.string()).optional(),
        notes: z.string().optional(),
    })
    .refine(
        (data) => {
            // Check if at least one of the properties is present and not undefined
            return Object.values(data).some((value) => value !== undefined);
        },
        {
            message: 'At least one field must be provided',
        }
    );
