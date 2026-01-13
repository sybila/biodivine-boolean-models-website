export class ModelNotFoundError extends Error {
    id: number;

    constructor(id: number) {
        super(`Nonexistent BooleanModel with id ${id}`);
        this.id = id;
    }
}

export interface BooleanModelID {
    id: number;
}
