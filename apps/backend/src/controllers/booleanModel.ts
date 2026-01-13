import type { Request, Response } from 'express';
import BooleanModelRepository from '../repositories/booleanModel.read.js';
import { validateId } from '../validation.js';

export const readSpecificController = async (req: Request, res: Response) => {
    const validatedId = validateId.parse(req.params);
    const booleanModel = await BooleanModelRepository.readOne(validatedId);
    res.status(200).send({ data: booleanModel });
};

export const readAllController = async (_req: Request, res: Response) => {
    const allBooleanModels = await BooleanModelRepository.readAll();
    res.status(200).send({ data: allBooleanModels });
};

export const readDataController: (
    dbMimeType: string,
    fileMimeType: string,
    extension: string
) => (req: Request, res: Response) => Promise<void> = (dbMimeType, fileMimeType, extension) => {
    return async (req: Request, res: Response) => {
        const validatedId = validateId.parse(req.params);
        const modelData = await BooleanModelRepository.readOneData(validatedId, dbMimeType);

        res.set({
            'Content-Type': fileMimeType,
            'Content-Disposition': `attachment; filename="${String(validatedId.id).padStart(3, '0')}${extension}"`,
            'Content-Length': Buffer.byteLength(modelData.modelData, 'utf-8'),
        });

        res.status(200).send(modelData.modelData);
    };
};
