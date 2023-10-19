import type { Request, Response } from 'express';
import { handleErrors, validateId } from "../../validationModels/common";
import ModelRepository from "../../repositories/model";

export const readSpecificModelController = async (req: Request, res: Response) => {
    try {
        const validatedId = validateId.parse(req.params);
        const model = await ModelRepository.read.readOne(validatedId);
        return res.status(200).send({ data: model.unwrap() });
    } catch (e) {
        return handleErrors(e, res);
    }
};

export const readAllModelsController = async (req: Request, res: Response) => {
    try {
        const allModels = await ModelRepository.read.readAll();
        return res.status(200).send({ data: allModels.unwrap() });
    } catch (e) {
        return handleErrors(e, res);
    }
};
