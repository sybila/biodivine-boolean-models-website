import bibtexParse, { BibTeXEntry, BibTeXField } from 'bibtex-parse';
import { atom } from 'jotai';
import { atomWithQuery } from 'jotai-tanstack-query';
import * as BbmApiService from '../BbmApiService.ts';
import { LoadedBooleanModel } from '../types.ts';

/**
 * Fetch all models from the API, parse their Bib entries, and store them for later.
 */
export const allModelsAtom = atomWithQuery<LoadedBooleanModel[]>(() => {
    return {
        queryKey: ['models'],
        queryFn: async () => {
            return (await BbmApiService.getAll()).map((model) => {
                const result = model as LoadedBooleanModel;
                const parsedBib = bibtexParse.parse(model.bib).filter((it) => it.itemtype == 'entry');
                if (parsedBib.length === 0) {
                    console.log(`[Id=${model.id}; Warning] No bibliography: ${model.bib}`);
                    result.parsedBib = undefined;
                    result.journal = undefined;
                    result.year = undefined;
                    return result;
                } else {
                    if (parsedBib.length > 1) {
                        console.log(`[Id=${model.id}; Warning] Extra bibliography: ${model.bib}`);
                        console.log(parsedBib);
                    }
                    const bibItem = parsedBib[0] as BibTeXEntry;
                    result.parsedBib = bibItem;
                    result.journal = findFieldValue(bibItem.fields, 'journal')?.toLowerCase();
                    // TODO: This could also be other special characters.
                    result.year = findFieldValue(bibItem.fields, 'year')?.toLowerCase().replace(/['"]+/g, '');
                    return result;
                }
            });
        },
    };
});

/**
 * Once we have all models available, we can extract all keywords from them (for filtering).
 */
export const allKeywordsAtom = atom<Promise<Set<string>>>(async (get) => {
    const { data } = get(allModelsAtom);
    if (data === undefined) return new Set();

    const result = new Set<string>();
    for (const model of data) {
        for (const kw of model.keywords) {
            result.add(kw);
        }
    }
    return result;
});

/**
 * Helper function that searches for the value of the given Bibtex field, assuming it exists.
 */
function findFieldValue(array: BibTeXField[], name: string): string | null {
    const field = array.find((item) => item.name.toLowerCase() === name);
    return field ? JSON.stringify(field.value) : null;
}
