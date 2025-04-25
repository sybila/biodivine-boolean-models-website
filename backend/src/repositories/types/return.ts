import { Model } from '@prisma/client';
import DbResult from './common';

export type ModelReadSpecificResult = DbResult<Model>;
export type ModelReadFilteredResult = DbResult<Model[]>;
