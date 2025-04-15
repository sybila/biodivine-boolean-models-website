import { Model } from '@prisma/client';
import DbResult from './common';

type DbModel = DbResult<Model>;

export type ModelResult = DbModel;
export type ModelReadSpecificResult = DbResult<Model>;
export type ModelReadFilteredResult = DbResult<Model[]>;
