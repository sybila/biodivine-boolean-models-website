import { Result } from '@badrap/result';
import client from '@database/client';
import { BooleanModelID } from '../types/data';
import { BooleanModelReadFilteredResult, BooleanModelReadSpecificResult } from '../types/return';

const readOne = async (data: BooleanModelID): BooleanModelReadSpecificResult => {
    try {
        return await client.$transaction(async (tx) => {
            const model = await tx.booleanModel.findUniqueOrThrow({
                where: { id: data.id },
            });
            return Result.ok(model);
        });
    } catch (e) {
        return Result.err(e as Error);
    }
};

const readAll = async (): BooleanModelReadFilteredResult => {
    try {
        return await client.$transaction(async (tx) => {
            const models = await tx.booleanModel.findMany();
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
