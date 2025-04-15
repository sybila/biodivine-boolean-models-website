import { atom } from 'recoil';
import { Model } from '../types/data';

export const searchNameQueryAtom = atom<string>({
    key: 'searchNameQuery',
    default: '',
});

export const searchBibJournalQueryAtom = atom<string>({
    key: 'searchBibJournalQuery',
    default: '',
});

export const searchBibYearQueryAtom = atom<string>({
    key: 'searchBibYearQuery',
    default: '',
});

export const sortByAtom = atom<string>({
    key: 'sortBy',
    default: 'name',
});

export const sortOrderAtom = atom<string>({
    key: 'sortOrder',
    default: 'asc',
});

export const selectedKeywordsAtom = atom<string[]>({
    key: 'selectedKeywords',
    default: [],
});

export const showAdvancedAFiltersAtom = atom<boolean>({
    key: 'showAdvancedFilters',
    default: false,
});

export const filterChangedAtom = atom<boolean>({
    key: 'filterChanged',
    default: false,
});

export const filteredModelsAtom = atom<Model[]>({
    key: 'filteredModels',
    default: [],
});

export const pageNumberAtom = atom<number>({
    key: 'pageNumber',
    default: 1,
});
