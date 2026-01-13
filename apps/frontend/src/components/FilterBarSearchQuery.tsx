import { Stack, TextField } from '@mui/material';
import { useAtom } from 'jotai';
import type { ChangeEvent } from 'react';
import { searchQueryAtom } from '../state/searchAtoms.ts';

const FilterBarSearchQuery = () => {
    const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);

    const changeSearchQuery = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    return (
        <Stack direction="row" spacing={1} alignItems="center">
            <div>
                <b>Filter by:</b>
            </div>
            <TextField
                label="Query..."
                variant="outlined"
                value={searchQuery}
                size="small"
                onChange={changeSearchQuery}
            />
        </Stack>
    );
};

export default FilterBarSearchQuery;
