import ClearIcon from '@mui/icons-material/Clear';
import SettingsIcon from '@mui/icons-material/Settings';
import { Box, Button, Card, CardContent, Chip, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
    filteredKeywordCountsAtom,
    searchBibJournalQueryAtom,
    searchBibYearQueryAtom,
    searchQueryAtom,
    selectedKeywordsAtom,
    showAdvancedFiltersAtom,
} from '../state/searchAtoms.ts';
import { AEON_BUTTON, AEON_CARD } from '../styles.ts';
import FilterBarJournalQuery from './FilterBarJournalQuery.tsx';
import FilterBarSearchQuery from './FilterBarSearchQuery.tsx';
import FilterBarYearQuery from './FilterBarYearQuery.tsx';
import FilterBarSortBySelect from './FilterBySortBySelect.tsx';

const FilterBar = () => {
    const theme = useTheme();

    const keywordCounts = useAtomValue(filteredKeywordCountsAtom);
    const [selectedKeywords, setSelectedKeywords] = useAtom(selectedKeywordsAtom);
    const [showAdvancedFilters, setShowAdvancedFilters] = useAtom(showAdvancedFiltersAtom);
    const setSearchQuery = useSetAtom(searchQueryAtom);
    const setBibJournalQuery = useSetAtom(searchBibJournalQueryAtom);
    const setBibYearQuery = useSetAtom(searchBibYearQueryAtom);

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
        if (showAdvancedFilters) {
            // If we are closing the panel, make sure to reset all filters:
            setSearchQuery('');
            setBibJournalQuery('');
            setBibYearQuery('');
            setSelectedKeywords([]);
        }
        setShowAdvancedFilters(!showAdvancedFilters);
    };

    return (
        <div style={{ position: 'relative', marginTop: '2rem' }}>
            <Card
                sx={{
                    ...AEON_CARD,
                    // Render a small "mini header" at the top-left of the card.
                    '&:before': {
                        content: "'Sort & Filter'",
                        backgroundColor: 'var(--white)',
                        fontWeight: 'bold',
                        position: 'absolute',
                        top: '-0.7rem',
                        left: theme.spacing(1),
                        padding: `0 ${theme.spacing(1)}`,
                    },
                }}
            >
                <CardContent
                    sx={{
                        // MUI will try to put larger 3x padding at the end of each card do add "breathing room".
                        // We very much don't want that here.
                        paddingBottom: `${theme.spacing(2)} !important`,
                    }}
                >
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
                                <Stack direction="row" alignItems="center" spacing={2} divider={<span>|</span>}>
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
                                        // no matter the number of models in its category. There is always the
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
