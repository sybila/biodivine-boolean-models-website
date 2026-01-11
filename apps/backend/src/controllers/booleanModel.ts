import type { Request, Response } from 'express';
import BooleanModelRepository from '../repositories/booleanModel.read.js';
import { handleErrors, validateId } from '../validationModels/common.js';

export const readSpecificController = async (req: Request, res: Response) => {
    try {
        const validatedId = validateId.parse(req.params);
        const booleanModel = await BooleanModelRepository.readOne(validatedId);
        res.status(200).send({ data: booleanModel });
    } catch (e) {
        handleErrors(e, res);
    }
};

export const readAllController = async (_req: Request, res: Response) => {
    try {
        const allBooleanModels = await BooleanModelRepository.readAll();
        res.status(200).send({ data: allBooleanModels });
    } catch (e) {
        handleErrors(e, res);
    }
};
