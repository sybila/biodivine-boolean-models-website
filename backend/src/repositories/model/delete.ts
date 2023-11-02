import client from "../client";
import {Result} from "@badrap/result";
import {ModelID} from "../types/data";
import {ModelResult} from "../types/return";

const deleteModel = async (data: ModelID): ModelResult => {
    try {
        return await client.$transaction(async (tx) => {
            const model = await tx.model.delete({ where: { id: data.id }});
            return Result.ok(model);
        })
    } catch (e) {
        return Result.err(e as Error);
    }
};

export default deleteModel;
