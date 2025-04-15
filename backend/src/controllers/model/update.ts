import type { Request, Response } from 'express';
import ModelRepository from '../../repositories/model';
import { ModelUpdateData } from '../../repositories/types/data';
import { handleErrors, validateId, validateModelUpdateBody } from '../../validationModels/common';

export const updateModelController = async (req: Request, res: Response) => {
    try {
        const validatedId = validateId.parse(req.params);
        const validatedBody = validateModelUpdateBody.parse(req.body);
        const updatedModel = await ModelRepository.update({ ...validatedId, ...(validatedBody as ModelUpdateData) });
        return res.status(200).send({ data: updatedModel.unwrap() });
    } catch (e) {
        return handleErrors(e, res);
    }
};
