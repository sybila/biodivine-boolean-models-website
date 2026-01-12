import { atom } from 'jotai';
import { BooleanModel } from '../types.ts';

export const searchNameQueryAtom = atom<string>('');

export const searchBibJournalQueryAtom = atom<string>('');

export const searchBibYearQueryAtom = atom<string>('');

export const sortByAtom = atom<string>('');

export const sortOrderAtom = atom<string>('');

export const selectedKeywordsAtom = atom<string[]>([]);

export const showAdvancedAFiltersAtom = atom<boolean>(false);

export const filterChangedAtom = atom<boolean>(false);

export const filteredModelsAtom = atom<BooleanModel[]>([]);

export const pageNumberAtom = atom<number>(1);
