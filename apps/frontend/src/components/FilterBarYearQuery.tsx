import { Stack, TextField } from '@mui/material';
import { useAtom } from 'jotai';
import type { ChangeEvent } from 'react';
import { searchBibYearQueryAtom } from '../state/searchAtoms.ts';

const FilterBarYearQuery = () => {
    const [searchBibYearQuery, setSearchBibYearQuery] = useAtom(searchBibYearQueryAtom);

    const changeBibYearQuery = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchBibYearQuery(e.target.value);
    };

    return (
        <Stack direction="row" spacing={1} alignItems="center">
            <div>
                <b>Available since:</b>
            </div>
            <TextField
                label="Year(s)..."
                variant="outlined"
                value={searchBibYearQuery}
                size="small"
                onChange={changeBibYearQuery}
            />
        </Stack>
    );
};

export default FilterBarYearQuery;
