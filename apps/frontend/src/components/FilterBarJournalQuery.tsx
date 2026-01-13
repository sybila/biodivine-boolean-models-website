import { Stack, TextField } from '@mui/material';
import { useAtom } from 'jotai';
import type { ChangeEvent } from 'react';
import { searchBibJournalQueryAtom } from '../state/searchAtoms.ts';

const FilterBarJournalQuery = () => {
    const [searchBibJournalQuery, setSearchBibJournalQuery] = useAtom(searchBibJournalQueryAtom);

    const changeBibJournalQuery = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchBibJournalQuery(e.target.value);
    };

    return (
        <Stack direction="row" spacing={1} alignItems="center">
            <div>
                <b>Published by:</b>
            </div>
            <TextField
                label="Journal(s)..."
                variant="outlined"
                value={searchBibJournalQuery}
                size="small"
                onChange={changeBibJournalQuery}
            />
        </Stack>
    );
};

export default FilterBarJournalQuery;
