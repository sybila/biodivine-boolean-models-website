import SouthOutlinedIcon from '@mui/icons-material/SouthOutlined';
import { IconButton, MenuItem, Select, type SelectChangeEvent, Stack } from '@mui/material';
import { useAtom } from 'jotai';
import { sortByAtom } from '../state/sortAtoms.ts';
import { ModelSortKey, ModelSortKeyValues } from '../types.ts';

const FilterBarSortBySelect = () => {
    const [[sortByKey, sortAscending], setSortBy] = useAtom(sortByAtom);

    const changeSortBy = (e: SelectChangeEvent) => {
        switch (e.target.value as ModelSortKeyValues) {
            case ModelSortKey.ID[0]:
                setSortBy(ModelSortKey.ID);
                break;
            case ModelSortKey.NAME[0]:
                setSortBy(ModelSortKey.NAME);
                break;
            case ModelSortKey.YEAR[0]:
                setSortBy(ModelSortKey.YEAR);
                break;
            case ModelSortKey.ALL_NODES[0]:
                setSortBy(ModelSortKey.ALL_NODES);
                break;
            case ModelSortKey.INPUT_NODES[0]:
                setSortBy(ModelSortKey.INPUT_NODES);
                break;
            case ModelSortKey.VARIABLE_NODES[0]:
                setSortBy(ModelSortKey.VARIABLE_NODES);
                break;
            case ModelSortKey.REGULATIONS[0]:
                setSortBy(ModelSortKey.REGULATIONS);
                break;
            case ModelSortKey.QUERY_MATCHES[0]:
                setSortBy(ModelSortKey.QUERY_MATCHES);
                break;
        }
    };

    const toggleSortOrder = () => {
        setSortBy(([prevKey, prevSort]: [[ModelSortKeyValues, boolean], [ModelSortKeyValues, boolean]]) => [
            prevKey,
            !prevSort,
        ]);
    };

    const sortIconRotation = sortAscending ? '180deg' : '0deg';

    return (
        <Stack direction="row" spacing={1} alignItems="center">
            <div>
                <b>Sort by:</b>
            </div>
            <div>
                <Select
                    value={sortByKey}
                    onChange={changeSortBy}
                    size="small"
                    sx={{ width: { xs: 'auto', md: '20ch' } }}
                >
                    <MenuItem value={ModelSortKey.ID[0]} sx={{ justifyContent: 'center' }}>
                        {ModelSortKey.ID[0]}
                    </MenuItem>
                    <MenuItem value={ModelSortKey.NAME[0]} sx={{ justifyContent: 'center' }}>
                        {ModelSortKey.NAME[0]}
                    </MenuItem>
                    <MenuItem value={ModelSortKey.YEAR[0]} sx={{ justifyContent: 'center' }}>
                        {ModelSortKey.YEAR[0]}
                    </MenuItem>
                    <MenuItem value={ModelSortKey.ALL_NODES[0]} sx={{ justifyContent: 'center' }}>
                        {ModelSortKey.ALL_NODES[0]}
                    </MenuItem>
                    <MenuItem value={ModelSortKey.INPUT_NODES[0]} sx={{ justifyContent: 'center' }}>
                        {ModelSortKey.INPUT_NODES[0]}
                    </MenuItem>
                    <MenuItem value={ModelSortKey.VARIABLE_NODES[0]} sx={{ justifyContent: 'center' }}>
                        {ModelSortKey.VARIABLE_NODES[0]}
                    </MenuItem>
                    <MenuItem value={ModelSortKey.REGULATIONS[0]} sx={{ justifyContent: 'center' }}>
                        {ModelSortKey.REGULATIONS[0]}
                    </MenuItem>
                    <MenuItem value={ModelSortKey.QUERY_MATCHES[0]} sx={{ justifyContent: 'center' }}>
                        {ModelSortKey.QUERY_MATCHES[0]}
                    </MenuItem>
                </Select>
            </div>
            <div>
                <IconButton
                    onClick={toggleSortOrder}
                    aria-label="Toggle sort order"
                    sx={{
                        transition: 'transform 0.3s ease',
                        transform: `rotate(${sortIconRotation})`,
                    }}
                >
                    <SouthOutlinedIcon />
                </IconButton>
            </div>
        </Stack>
    );
};

export default FilterBarSortBySelect;
