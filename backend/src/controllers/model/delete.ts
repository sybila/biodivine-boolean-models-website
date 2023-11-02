import type { Request, Response } from 'express';
import ModelRepository from "../../repositories/model";
import {handleErrors, validateId} from "../../validationModels/common";
export const deleteModelController = async (req: Request, res: Response) => {
    try {
        const validatedId = validateId.parse(req.params);
        const deletedModel = await ModelRepository.delete(validatedId);
        return res.status(201).send({ data: deletedModel.unwrap() });
    } catch (e) {
        return handleErrors(e, res);
    }
}
