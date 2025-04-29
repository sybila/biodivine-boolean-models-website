import type { Request, Response } from 'express';
import BooleanModelRepository from '../../repositories/booleanModel';
import { handleErrors, validateId } from '../../validationModels/common';

export const readSpecificController = async (req: Request, res: Response) => {
    try {
        const validatedId = validateId.parse(req.params);
        const booleanModel = await BooleanModelRepository.read.readOne(validatedId);
        res.status(200).send({ data: booleanModel.unwrap() });
    } catch (e) {
        handleErrors(e, res);
    }
};

export const readAllController = async (_req: Request, res: Response) => {
    try {
        const allBooleanModels = await BooleanModelRepository.read.readAll();
        res.status(200).send({ data: allBooleanModels.unwrap() });
    } catch (e) {
        handleErrors(e, res);
    }
};
