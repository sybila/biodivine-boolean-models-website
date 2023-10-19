import client from "../client";
import {Result} from "@badrap/result";
import {ModelCreateData} from "../types/data";
import {ModelCreateResult} from "../types/return";

const createModel = async (data: ModelCreateData): ModelCreateResult => {
    try {
        return await client.$transaction(async (tx) => {
            const model = await tx.model.create({ data: { ...data } });
            return Result.ok(model);
        })
    } catch (e) {
        return Result.err(e as Error);
    }
};

export default createModel;
