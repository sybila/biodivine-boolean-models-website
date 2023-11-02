import DbResult from "./common";
import { Model } from "@prisma/client";

type DbModel = DbResult<Model>

export type ModelResult = DbModel;
export type ModelReadSpecificResult = DbResult<Model>;
export type ModelReadFilteredResult = DbResult<Model[]>;
