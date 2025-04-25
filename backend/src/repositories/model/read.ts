import { Result } from '@badrap/result';
import client from '../client';
import { ModelID } from '../types/data';
import { ModelReadFilteredResult, ModelReadSpecificResult } from '../types/return';

const readOne = async (data: ModelID): ModelReadSpecificResult => {
    try {
        return await client.$transaction(async (tx) => {
            const model = await tx.model.findUniqueOrThrow({
                where: { id: data.id },
            });
            return Result.ok(model);
        });
    } catch (e) {
        return Result.err(e as Error);
    }
};

const readAll = async (): ModelReadFilteredResult => {
    try {
        return await client.$transaction(async (tx) => {
            const models = await tx.model.findMany();
            return Result.ok(models);
        });
    } catch (e) {
        return Result.err(e as Error);
    }
};

export default {
    readOne,
    readAll,
};
