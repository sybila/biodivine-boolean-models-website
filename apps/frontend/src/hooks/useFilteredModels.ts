import { BooleanModel } from '@biodivine-boolean-models-website/database/src/generated/prisma/client.ts';
import bibtexParse, { BibTeXEntry, BibTeXField } from 'bibtex-parse';
import { useEffect, useState } from 'react';
import { FilterOptions } from '../types.ts';

const useFilteredModels = (
    models: BooleanModel[],
    { searchNameQuery, searchBibJournalQuery, searchBibYearQuery, sortBy, sortOrder, selectedKeywords }: FilterOptions
) => {
    const [filteredModels, setFilteredModels] = useState<BooleanModel[]>([]);

    useEffect(() => {
        if (!models) return;

        const findValueByName = (array: BibTeXField[], name: string) => {
            const field = array.find((item) => item.name === name);
            return field ? JSON.stringify(field.value) : undefined;
        };

        const filtered = models.filter((model) => {
            const keywordMatch =
                selectedKeywords.length === 0 || selectedKeywords.every((keyword) => model.keywords.includes(keyword));
            const nameMatch = model.name.toLowerCase().includes(searchNameQuery.toLowerCase());

            let journalMatch = false;
            let yearMatch = false;

            // Parse the BibTex data
            const parsedBib = bibtexParse.parse(model.bib);
            const bibItem = parsedBib[0] as BibTeXEntry;

            const journal = findValueByName(bibItem.fields, 'journal');
            const school = findValueByName(bibItem.fields, 'school');
            const bookTitle = findValueByName(bibItem.fields, 'booktitle');

            // Journal match check
            if (journal) {
                journalMatch = journal.toLowerCase().includes(searchBibJournalQuery.toLowerCase());
            } else if (school) {
                journalMatch = school.toLowerCase().includes(searchBibJournalQuery.toLowerCase());
            } else if (bookTitle) {
                journalMatch = bookTitle.toLowerCase().includes(searchBibJournalQuery.toLowerCase());
            }

            // Year match check
            const year = findValueByName(bibItem.fields, 'year');
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
