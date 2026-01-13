import { BooleanModelID, ModelNotFoundError } from './types.js';

import { newClient } from '@biodivine-boolean-models-website/database/dist/client.js';
import {
    BooleanModel,
    BooleanModelData,
} from '@biodivine-boolean-models-website/database/src/generated/prisma/client.js';

const client = newClient();

// Define individual accessor methods:

const readOne: (data: BooleanModelID) => Promise<BooleanModel> = async (data) => {
    const model = await client.booleanModel.findUnique({ where: { id: data.id } });
    if (!model) throw new ModelNotFoundError(data.id);
    return model;
};

const readOneData: (data: BooleanModelID, mimeType: string) => Promise<BooleanModelData> = async (data, mimeType) => {
    const id = { modelId: data.id, mimeType: mimeType };
    const model = await client.booleanModelData.findUnique({ where: { modelId_mimeType: id } });
    if (!model) throw new ModelNotFoundError(data.id);
    return model;
};

const readAll: () => Promise<BooleanModel[]> = async () => {
    return client.booleanModel.findMany();
};

export default {
    readOne,
    readOneData,
    readAll,
};
