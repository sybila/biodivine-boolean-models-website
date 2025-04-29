import { BooleanModel } from '@prisma/client';
import DbResult from './common';

export type BooleanModelReadSpecificResult = DbResult<BooleanModel>;
export type BooleanModelReadFilteredResult = DbResult<BooleanModel[]>;
