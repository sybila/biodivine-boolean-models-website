export interface ModelID {
    id: string;
}

export interface ModelCreateData {
    name: string;
    urlPublication: string;
    urlModel: string;
    keywords: string[];
    variables: number;
    inputs: number;
    regulations: number;
    notes: string;
    bib: string;
    modelData: Buffer;
}

export type ModelUpdateData = ModelID & {
    name?: string;
    urlPublication?: string;
    urlModel?: string;
    keywords?: string[];
    notes?: string;
} & AtLeastOne<{
        name: string;
        urlPublication: string;
        urlModel: string;
        keywords: string[];
        notes: string;
    }>;

type AtLeastOne<T> = {
    [K in keyof T]: Required<Pick<T, K>> & Partial<T>;
}[keyof T];
