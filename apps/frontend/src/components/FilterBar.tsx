import ClearIcon from '@mui/icons-material/Clear';
import SettingsIcon from '@mui/icons-material/Settings';
import { Box, Button, Card, CardContent, Chip, Stack } from '@mui/material';
import { useAtom, useAtomValue } from 'jotai';
import { filteredKeywordCountsAtom, selectedKeywordsAtom, showAdvancedFiltersAtom } from '../state/searchAtoms.ts';
import { AEON_BUTTON } from '../styles.ts';
import FilterBarJournalQuery from './FilterBarJournalQuery.tsx';
import FilterBarSearchQuery from './FilterBarSearchQuery.tsx';
import FilterBarYearQuery from './FilterBarYearQuery.tsx';
import FilterBarSortBySelect from './FilterBySortBySelect.tsx';

const FilterBar = () => {
    // TODO: Handle reset

    const keywordCounts = useAtomValue(filteredKeywordCountsAtom);
    const [selectedKeywords, setSelectedKeywords] = useAtom(selectedKeywordsAtom);
    const [showAdvancedFilters, setShowAdvancedFilters] = useAtom(showAdvancedFiltersAtom);

    const toggleKeyword = (keyword: string) => {
        setSelectedKeywords((prevState) => {
            if (prevState.includes(keyword)) {
                return prevState.filter((item) => item !== keyword);
            } else {
                return [...prevState, keyword];
            }
        });
    };

    const toggleAdvancedFilters = () => {
        setShowAdvancedFilters(!showAdvancedFilters);
    };

    // TODO: Probably just define our own card?
    return (
        <div style={{ position: 'relative', marginTop: '2rem' }}>
            <Card
                id="search-and-filter"
                sx={{ borderRadius: '1rem', boxShadow: 'none', border: '2px solid var(--black)' }}
            >
                <CardContent>
                    <Stack direction="column" spacing={2}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Stack direction="row" spacing={2} alignItems="center" divider={<span>|</span>}>
                                <FilterBarSearchQuery />
                                <FilterBarSortBySelect />
                            </Stack>
                            <Box sx={{ flexGrow: 1 }} />
                            <Button
                                variant="contained"
                                endIcon={showAdvancedFilters ? <ClearIcon /> : <SettingsIcon />}
                                onClick={toggleAdvancedFilters}
                                disableElevation
                                sx={AEON_BUTTON}
                            >
                                {showAdvancedFilters ? 'Reset' : 'Advanced'}
                            </Button>
                        </Stack>
                        {showAdvancedFilters && (
                            <>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <FilterBarJournalQuery />
                                    <FilterBarYearQuery />
                                </Stack>
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    spacing={1}
                                    useFlexGap
                                    sx={{ marginTop: '16px', flexWrap: 'wrap' }}
                                >
                                    <b>Keywords:</b>{' '}
                                    {keywordCounts.map(([keyword, count], index) => {
                                        const isDisabled = count === 0;
                                        const isChecked = selectedKeywords.includes(keyword);
                                        const label = `${keyword} (${count})`;
                                        const ghostLabel = `${keyword} (888)`; // For text-width calculations.

                                        // This "minor hack" with the label text causes the chip to have the same width,
                                        // no matter the number of models in its category, because there is always the
                                        // ghost label that forces it to have the greatest possible width.
                                        return (
                                            <Chip
                                                key={index}
                                                label={
                                                    <Box
                                                        sx={{
                                                            display: 'grid',
                                                            gridTemplateColumns: '1fr',
                                                            alignItems: 'center',
                                                            justifyItems: 'center',
                                                        }}
                                                    >
                                                        {/* 1. The Ghost (Invisible but takes space) */}
                                                        <Box
                                                            component="span"
                                                            aria-label="hidden"
                                                            sx={{
                                                                gridArea: '1 / 1',
                                                                visibility: 'hidden',
                                                                whiteSpace: 'pre', // Prevents collapsing spaces
                                                            }}
                                                        >
                                                            {ghostLabel}
                                                        </Box>

                                                        {/* 2. The Real Text (Visible and centered) */}
                                                        <Box
                                                            component="span"
                                                            sx={{
                                                                gridArea: '1 / 1',
                                                                whiteSpace: 'pre',
                                                            }}
                                                        >
                                                            {label}
                                                        </Box>
                                                    </Box>
                                                }
                                                size="small"
                                                color={isChecked ? 'primary' : 'default'}
                                                variant={isDisabled ? 'outlined' : 'filled'}
                                                disabled={isDisabled}
                                                onClick={() => toggleKeyword(keyword)}
                                            ></Chip>
                                        );
                                    })}
                                </Stack>
                            </>
                        )}
                    </Stack>
                </CardContent>
            </Card>
        </div>
    );
};

export default FilterBar;
