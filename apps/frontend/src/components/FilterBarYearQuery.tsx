import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { IconButton, TextField } from '@mui/material';
import { useAtom } from 'jotai';
import type { ChangeEvent } from 'react';
import { searchBibYearQueryAtom } from '../state/searchAtoms.ts';

const FilterBarYearQuery = () => {
    const [searchBibYearQuery, setSearchBibYearQuery] = useAtom(searchBibYearQueryAtom);

    const changeBibYearQuery = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchBibYearQuery(e.target.value);
    };

    return (
        <TextField
            label="Search Year"
            variant="outlined"
            size="small"
            value={searchBibYearQuery}
            onChange={changeBibYearQuery}
            slotProps={{
                input: {
                    endAdornment: (
                        <IconButton aria-label="Search year">
                            <SearchOutlinedIcon />
                        </IconButton>
                    ),
                },
            }}
        />
    );
};

export default FilterBarYearQuery;
