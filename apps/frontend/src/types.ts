export { type BooleanModel } from '@biodivine-boolean-models-website/database/src/generated/prisma/client.ts';
export type FileFormat = 'aeon' | 'sbml' | 'bnet' | 'booleannet' | 'bma';

export interface FilterOptions {
    searchNameQuery: string;
    searchBibJournalQuery: string;
    searchBibYearQuery: string;
    sortBy: string; // Replace with actual sort options
    sortOrder: string;
    selectedKeywords: string[];
}

export interface FilterBarProps {
    searchNameQuery: string;
    setSearchNameQuery: (value: string) => void;
    searchBibJournalQuery: string;
    setSearchBibJournalQuery: (value: string) => void;
    searchBibYearQuery: string;
    setSearchBibYearQuery: (value: string) => void;
    sortBy: string;
    setSortBy: (value: string) => void;
    filterChanged: boolean;
    setFilterChanged: (value: boolean) => void;
    sortOrder: string;
    uniqueKeywords: string[];
    countModelsForKeyword: (value: string) => number;
    selectedKeywords: string[];
    handleKeywordChange: (value: string) => void;
    toggleSortOrder: () => void;
    showAdvancedFilters: boolean;
    toggleAdvancedFilters: () => void;
    handleResetFilters: () => void;
}
