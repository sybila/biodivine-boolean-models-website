import client from "../client";
import {Result} from "@badrap/result";
import {ModelUpdateData} from "../types/data";
import {ModelResult} from "../types/return";

const updateModel = async (data: ModelUpdateData): ModelResult => {
    try {
        return await client.$transaction(async (tx) => {
            const model = await tx.model.update({
                where: { id: data.id },
                data: { ...data },
            });
            return Result.ok(model);
        })
    } catch (e) {
        return Result.err(e as Error);
    }
};

export default updateModel;
