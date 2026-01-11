import type { Response } from 'express';
import { z, ZodError } from 'zod';
import { ModelNotFoundError } from '../repositories/types.js';
import { ApiResponse } from '../types.js';

export const handleErrors = (e: unknown, res: Response) => {
    if (e instanceof ZodError) {
        const zodErrorResponse: ApiResponse<object> = {
            status: 'failure',
            error: e.issues[0].message,
        };
        return res.status(400).send(zodErrorResponse);
    }
    if (e instanceof ModelNotFoundError) {
        const nonExistentRecordErrorResponse: ApiResponse<object> = {
            status: 'failure',
            error: e.message,
        };
        return res.status(404).send(nonExistentRecordErrorResponse);
    }
    const serverFailResponse: ApiResponse<object> = {
        status: 'failure',
        error: e instanceof Error ? e.message : String(e),
    };
    return res.status(500).send(serverFailResponse);
};

export const validateId = z.object({
    id: z.coerce.number().int().positive(),
});
