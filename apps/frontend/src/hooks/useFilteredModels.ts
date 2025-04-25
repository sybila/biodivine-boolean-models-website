import { useEffect, useState } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import bibtexParse from 'bibtex-parse';
import { BibTexItem, FilterOptions, Model } from '../types/data.ts';

const useFilteredModels = (
    models: Model[],
    { searchNameQuery, searchBibJournalQuery, searchBibYearQuery, sortBy, sortOrder, selectedKeywords }: FilterOptions
) => {
    const [filteredModels, setFilteredModels] = useState<Model[]>([]);

    useEffect(() => {
        if (!models) return;

        const findValueByName = (array: BibTexItem[], name: string) => {
            const field = array.find((item) => item.name === name);
            return field ? field.value : undefined;
        };

        const filtered = models.filter((model) => {
            const keywordMatch =
                selectedKeywords.length === 0 || selectedKeywords.every((keyword) => model.keywords.includes(keyword));
            const nameMatch = model.name.toLowerCase().includes(searchNameQuery.toLowerCase());

            let journalMatch = false;
            let yearMatch = false;

            // Parse the BibTex data
            const parsedBib = bibtexParse.parse(model.bib);

            const journal = findValueByName(parsedBib[0].fields, 'journal');
            const school = findValueByName(parsedBib[0].fields, 'school');
            const bookTitle = findValueByName(parsedBib[0].fields, 'booktitle');

            // Journal match check
            if (journal) {
                journalMatch = journal.toLowerCase().includes(searchBibJournalQuery.toLowerCase());
            } else if (school) {
                journalMatch = school.toLowerCase().includes(searchBibJournalQuery.toLowerCase());
            } else if (bookTitle) {
                journalMatch = bookTitle.toLowerCase().includes(searchBibJournalQuery.toLowerCase());
            }

            // Year match check
            const year = findValueByName(parsedBib[0].fields, 'year');
            if (year) {
                yearMatch = year.toLowerCase().includes(searchBibYearQuery.toLowerCase());
            }

            return keywordMatch && nameMatch && journalMatch && yearMatch;
        });

        // Sorting logic
        const sortedModels = filtered.sort((a, b) => {
            let comparison = 0;
            switch (sortBy) {
                case 'name':
                    comparison = a.name.localeCompare(b.name);
                    break;
                case 'variables':
                    comparison = a.variables - b.variables;
                    break;
                case 'inputs':
                    comparison = a.inputs - b.inputs;
                    break;
                case 'regulations':
                    comparison = a.regulations - b.regulations;
                    break;
                default:
                    break;
            }

            return sortOrder === 'asc' ? comparison : -comparison;
        });

        setFilteredModels(sortedModels);
    }, [models, searchNameQuery, searchBibJournalQuery, searchBibYearQuery, sortBy, sortOrder, selectedKeywords]);

    return filteredModels;
};

export default useFilteredModels;
