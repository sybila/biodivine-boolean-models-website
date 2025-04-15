export type Model = {
    id: string;
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
};

export type BibTexItem = {
    name: string;
    value: string;
    datatype: string;
    raw: string;
};

export type FilterOptions = {
    searchNameQuery: string;
    searchBibJournalQuery: string;
    searchBibYearQuery: string;
    sortBy: string; // Replace with actual sort options
    sortOrder: string;
    selectedKeywords: string[];
};

export type FilterBarProps = {
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
};
