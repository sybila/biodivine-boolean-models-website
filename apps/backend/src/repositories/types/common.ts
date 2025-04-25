import { Result } from '@badrap/result';

type DbResult<T> = Promise<Result<T>>;

export default DbResult;
