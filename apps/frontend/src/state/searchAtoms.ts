import { atom } from 'jotai';
import { LoadedBooleanModel } from '../types.ts';
import { allKeywordsAtom, allModelsAtom } from './modelAtoms.ts';
import { modelsPageNumberAtom } from './sortAtoms.ts';

/*
    Filtering is the first step applied to the raw downloaded data. It includes keywords, publication and
    year queries that need to be satisfied for at least one "word" of input, plus a general search query that
    needs to be satisfied by at least one metadata item from the model.
 */

/**
 * Toggled when advanced filters are shown/hidden (does not alter the filtering algorithms).
 */
export const showAdvancedFiltersAtom = atom<boolean>(false);

const searchQueryAtomInternal = atom<string>('');
const searchBibJournalQueryAtomInternal = atom<string>('');
const searchBibYearQueryAtomInternal = atom<string>('');
const selectedKeywordsAtomInternal = atom<string[]>([]);

/**
 * If not empty, filter only models that contain the given string *somewhere* in their metadata.
 */
export const searchQueryAtom = atom(
    (get) => get(searchQueryAtomInternal),
    (_get, set, nextValue) => {
        set(modelsPageNumberAtom, 1);
        set(searchQueryAtomInternal, nextValue as string);
    }
);

/**
 * If not empty, filter only models that contain the given string in their bibliography publisher.
 */
export const searchBibJournalQueryAtom = atom(
    (get) => get(searchBibJournalQueryAtomInternal),
    (_get, set, nextValue) => {
        set(modelsPageNumberAtom, 1);
        set(searchBibJournalQueryAtomInternal, nextValue as string);
    }
);

/**
 * If not empty, filter only models that contain the given string in their bibliography year.
 */
export const searchBibYearQueryAtom = atom(
    (get) => get(searchBibYearQueryAtomInternal),
    (_get, set, nextValue) => {
        set(modelsPageNumberAtom, 1);
        set(searchBibYearQueryAtomInternal, nextValue as string);
    }
);

/**
 * If not empty, filter only models that contain all the given keywords.
 */
export const selectedKeywordsAtom = atom(
    (get) => get(selectedKeywordsAtomInternal),
    (_get, set, nextValue) => {
        set(modelsPageNumberAtom, 1);
        set(selectedKeywordsAtomInternal, nextValue as string[]);
    }
);

/**
 * Apply the `searchQuery`, `searchBibJournalQuery` and `searchBibYearQuery` filters to the main list of models.
 * Together with the model, also output the list of "match reasons" as human-readable strings. This explanation covers
 * only the main search query, not keywords/journal/year, because those must always match within one field.
 */
export const filteredModelsAtom = atom<Promise<[LoadedBooleanModel, string[]][]>>(async (get) => {
    const { data } = get(allModelsAtom);
    if (data === undefined) return [];
    const searchQuery = get(searchQueryAtom).toLowerCase().trim();
    const journalQuery = get(searchBibJournalQueryAtom).toLowerCase().trim();
    const yearQuery = get(searchBibYearQueryAtom).toLowerCase().trim();
    const keywords = get(selectedKeywordsAtom);

    const searchApplied: [LoadedBooleanModel, string[]][] = data
        .filter((model) => {
            // First, we check keywords because those need to match exactly:
            if (!keywords.every((kw) => model.keywords.includes(kw))) return false;
            // Then check journal and year by inclusion, but also terminate if a match is not found:
            return !(!findQueryInContent(journalQuery, model.journal) || !findQueryInContent(yearQuery, model.year));
        })
        .map((model) => {
            // Finally, search remaining metadata for words from the search query, saving info about where we found them:
            const queryMatches: string[] = [];
            if (searchQuery !== '') {
                for (const word of searchQuery.split(/\s+/)) {
                    const wordMatches = [];
                    if (model.name.toLowerCase().includes(word)) {
                        wordMatches.push('Name');
                    }
                    if (model.notes.toLowerCase().includes(word)) {
                        wordMatches.push('Notes');
                    }
                    if (model.keywords.some((kw) => kw.includes(word))) {
                        wordMatches.push('Keywords');
                    }
                    if (model.bib.toLowerCase().includes(word)) {
                        wordMatches.push('Bibliography');
                    }
                    if (findQueryInContentArray(word, model.variableNames)) {
                        wordMatches.push('Variables');
                    }
                    if (findQueryInContentArray(word, model.inputNames)) {
                        wordMatches.push('Inputs');
                    }
                    if (findQueryInContentArray(word, model.outputNames)) {
                        wordMatches.push('Outputs');
                    }

                    if (wordMatches.length > 0) {
                        queryMatches.push(`Term '${word}' found in [${wordMatches.join(', ')}]`);
                    }
                }
            }
            return [model, queryMatches];
        });

    if (searchQuery !== '') {
        return searchApplied.filter(([, reasons]) => reasons.length > 0);
    } else {
        return searchApplied;
    }
});

export const filteredKeywordCountsAtom = atom<Promise<[string, number][]>>(async (get) => {
    const allKeywords = await get(allKeywordsAtom);
    const filteredModels = await get(filteredModelsAtom);

    const result = new Map();
    for (const kw of allKeywords) {
        result.set(kw, 0); // We actually want to also include keywords with count zero.
        for (const [model, _reasons] of filteredModels) {
            if (model.keywords.some((it) => it === kw)) {
                result.set(kw, result.get(kw) + 1);
            }
        }
    }

    // Turn the map into a sorted array to ensure deterministic order.
    return Array.from(result.entries()).sort((a, b) => a[0].localeCompare(b[0]));
});

/**
 * Search for the given query in the given content. The search is a (case-insensitive) match if:
 *  - query is empty;
 *  - for some "word" in the query, there is a substring match in the content.
 */
function findQueryInContent(query: string, content: string | undefined) {
    if (query === '') return true;
    if (content === undefined) return false;
    content = content.toLowerCase();
    for (const word of query.split(/\s+/)) {
        if (content.includes(word)) {
            return true;
        }
    }
    return false;
}

/**
 * Same as `findQueryInContent`, but the match is valid if the item is found in any
 * of the content strings.
 */
function findQueryInContentArray(query: string, content: string[]) {
    if (query === '') return true;
    if (content.length === 0) return false;
    content = content.map((item) => item.toLowerCase());
    for (const word of query.split(/\s+/)) {
        if (content.some((item) => item.includes(word))) {
            return true;
        }
    }
    return false;
}
