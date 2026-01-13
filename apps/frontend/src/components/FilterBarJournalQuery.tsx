import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { IconButton, TextField } from '@mui/material';
import { useAtom } from 'jotai';
import type { ChangeEvent } from 'react';
import { searchBibJournalQueryAtom } from '../state/searchAtoms.ts';

const FilterBarJournalQuery = () => {
    const [searchBibJournalQuery, setSearchBibJournalQuery] = useAtom(searchBibJournalQueryAtom);

    const changeBibJournalQuery = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchBibJournalQuery(e.target.value);
    };

    return (
        <TextField
            label="Search Publication"
            variant="outlined"
            size="small"
            value={searchBibJournalQuery}
            onChange={changeBibJournalQuery}
            slotProps={{
                input: {
                    endAdornment: (
                        <IconButton aria-label="Search publication">
                            <SearchOutlinedIcon />
                        </IconButton>
                    ),
                },
            }}
        />
    );
};

export default FilterBarJournalQuery;
