import DbResult from "./common";
import { Model } from "@prisma/client";

type DbModel = DbResult<Model>

type ModelResult = {
    id: string,
    name: string,
    urlPublication: string,
    urlModel: string,
    keywords: string[],
    variables: number,
    inputs: number,
    regulations: number,
    notes: string,
    bib: string,
    modelData: Buffer
}

export type ModelCreateResult = DbModel;
export type ModelReadSpecificResult = DbResult<ModelResult>;
export type ModelReadFilteredResult = DbResult<ModelResult[]>;
