import type { Request, Response } from 'express';
import ModelRepository from "../../repositories/model";
import {handleErrors, validateModelCreateBody} from "../../validationModels/common";

export const createModelController = async (req: Request, res: Response) => {
    try {
        const validatedBody = validateModelCreateBody.parse(req.body);
        const newModel = await ModelRepository.create(validatedBody);
        return res.status(201).send({ data: newModel.unwrap() });
    } catch (e) {
        return handleErrors(e, res);
    }
}
