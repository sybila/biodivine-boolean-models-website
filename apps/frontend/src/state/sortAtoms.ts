import { atom } from 'jotai';
import { LoadedBooleanModel, ModelSortKey, ModelSortKeyValues } from '../types.ts';
import { filteredModelsAtom } from './searchAtoms.ts';

/*
    Sorting is the second step applied to the filtered list of models. It also
 */

/**
 * Atom that simply defines the page this listing is on. It must be reset whenever the search/sort atoms change.
 */
export const modelsPageNumberAtom = atom<number>(1);

const sortByAtomInternal = atom<readonly [ModelSortKeyValues, boolean]>(ModelSortKey.ID);

/**
 * Stores the current sorting configuration.
 */
export const sortByAtom = atom(
    (get) => get(sortByAtomInternal),
    (_get, set, nextValue) => {
        set(modelsPageNumberAtom, 1);
        set(sortByAtomInternal, nextValue as [ModelSortKeyValues, boolean]);
    }
);

export const sortedModelsAtom = atom<Promise<[LoadedBooleanModel, string[]][]>>(async (get) => {
    const filteredModels = await get(filteredModelsAtom);
    const [sortByKey, sortAscending] = get(sortByAtom);
    return filteredModels.sort(([left, lr], [right, rr]) => {
        let comparison = 0;
        const leftYear = Number(left.year ?? '0');
        const rightYear = Number(right.year ?? '0');

        switch (sortByKey) {
            case ModelSortKey.ID[0]:
                comparison = left.id - right.id;
                break;
            case ModelSortKey.NAME[0]:
                comparison = left.name.localeCompare(right.name);
                break;
            case ModelSortKey.YEAR[0]:
                // Try to interpret years as numbers:
                if (Number.isNaN(leftYear) || Number.isNaN(rightYear)) {
                    comparison = (left.year ?? '').localeCompare(right.year ?? '');
                } else {
                    comparison = leftYear - rightYear;
                }
                break;
            case ModelSortKey.ALL_NODES[0]:
                comparison = left.variables + left.inputs - (right.variables + right.inputs);
                break;
            case ModelSortKey.INPUT_NODES[0]:
                comparison = left.inputs - right.inputs;
                break;
            case ModelSortKey.VARIABLE_NODES[0]:
                comparison = left.variables - right.variables;
                break;
            case ModelSortKey.REGULATIONS[0]:
                comparison = left.regulations - right.regulations;
                break;
            case ModelSortKey.QUERY_MATCHES[0]:
                comparison = lr.length - rr.length;
                break;
        }

        return sortAscending ? comparison : -comparison;
    });
});
