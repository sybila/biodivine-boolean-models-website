import { BooleanModelID, ModelNotFoundError } from './types.js';

import { newClient } from '@biodivine-boolean-models-website/database/dist/client.js';
import { BooleanModel } from '@biodivine-boolean-models-website/database/src/generated/prisma/client.js';

const client = newClient();

// Define individual accessor methods:

const readOne: (data: BooleanModelID) => Promise<BooleanModel> = async (data) => {
    const model = await client.booleanModel.findUnique({ where: { id: data.id } });
    if (!model) throw new ModelNotFoundError(data.id);
    return model;
};

const readAll: () => Promise<BooleanModel[]> = async () => {
    return client.booleanModel.findMany();
};

export default {
    readOne,
    readAll,
};
