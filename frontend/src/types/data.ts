export type Model = {
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
