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
    id: z.coerce.number().int().positive(),
});
