import ArrowRightIcon from '@mui/icons-material/ArrowCircleRight';
import InfoIcon from '@mui/icons-material/Info';
import { Button, Card, CardContent, Chip, CircularProgress, Container, Pagination, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import FilterBar from '../components/FilterBar.tsx';
import { allModelsAtom } from '../state/modelAtoms.ts';
import { selectedKeywordsAtom, showAdvancedFiltersAtom } from '../state/searchAtoms.ts';
import { modelsPageNumberAtom, sortedModelsAtom } from '../state/sortAtoms.ts';
import { AEON_BUTTON, H1_HEADER, H1_HEADER_EMPHASIS, H2_PAGE_TITLE, H4_LIST_ITEM_TITLE } from '../styles.ts';

const ModelsPage = () => {
    // TODO: Error handling.
    const theme = useTheme();
    const { isLoading, isError } = useAtomValue(allModelsAtom);
    const [pageNumber, setPageNumber] = useAtom(modelsPageNumberAtom);
    const [selectedKeywords, setSelectedKeywords] = useAtom(selectedKeywordsAtom);
    const filteredAndSortedModels = useAtomValue(sortedModelsAtom);
    const numberOfModels = filteredAndSortedModels.length;
    const setShowAdvancedFilters = useSetAtom(showAdvancedFiltersAtom);

    const itemsPerPage = 25;
    const startIndex = (pageNumber - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedModels = filteredAndSortedModels.slice(startIndex, endIndex);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [pageNumber]);

    const toggleKeyword = (keyword: string) => {
        setShowAdvancedFilters(true); // As soon as I select a keyword, show me the advanced filters.
        setSelectedKeywords((prevState: string[]) => {
            if (prevState.includes(keyword)) {
                return prevState.filter((item) => item !== keyword);
            } else {
                return [...prevState, keyword];
            }
        });
    };

    return (
        <Container maxWidth="lg" sx={{ width: '100vw' }}>
            <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent="space-between"
                sx={{
                    marginTop: '8rem',
                    marginBottom: '4rem',
                    marginLeft: theme.spacing(2),
                    marginRight: theme.spacing(2),
                }}
            >
                <h1 style={H1_HEADER}>
                    BIODIVINE<span style={H1_HEADER_EMPHASIS}>/Boolean Models</span>
                </h1>
                <Button href="/" variant="contained" disableElevation sx={AEON_BUTTON} endIcon={<InfoIcon />}>
                    About Us
                </Button>
            </Stack>
            <FilterBar />
            <h2 style={{ marginLeft: theme.spacing(2), ...H2_PAGE_TITLE }}>Models List [{numberOfModels}]</h2>
            {isLoading || isError ? <CircularProgress /> : ''}
            <Stack direction="column" spacing={4}>
                {paginatedModels?.map(([model, reasons]) => (
                    <Card
                        sx={{ borderRadius: '1rem', boxShadow: 'none', border: '2px solid var(--black)' }}
                        key={model.id}
                    >
                        <CardContent sx={{ textAlign: 'left' }}>
                            <Stack direction="column" spacing={2}>
                                <Stack direction="row" alignItems="center" justifyContent="space-between">
                                    <h4 style={H4_LIST_ITEM_TITLE}>
                                        [{String(model.id).padStart(3, '0')}] {model.name}
                                    </h4>
                                    <Button
                                        component={Link}
                                        to={`/models/${model.id}`}
                                        variant="contained"
                                        disableElevation
                                        sx={AEON_BUTTON}
                                        endIcon={<ArrowRightIcon />}
                                    >
                                        Details
                                    </Button>
                                </Stack>
                                <Stack direction="row" alignItems="center" spacing={1} justifyContent="left">
                                    <b>Keywords:</b>
                                    {model.keywords.map((keyword, index) => (
                                        <Chip
                                            key={index}
                                            label={keyword}
                                            size="small"
                                            color={selectedKeywords.includes(keyword) ? 'primary' : 'default'}
                                            onClick={() => toggleKeyword(keyword)}
                                        ></Chip>
                                    ))}
                                </Stack>
                                <Stack direction="row" spacing={1}>
                                    <span>
                                        <b>Inputs:</b> {model.inputs}
                                    </span>
                                    <span>
                                        <b>Variables:</b> {model.variables}
                                    </span>
                                    <span>
                                        <b>Regulations:</b> {model.regulations}
                                    </span>
                                </Stack>
                                {reasons.length > 0 ? (
                                    <span>
                                        <b>Query match:</b> {reasons.join('; ')}.
                                    </span>
                                ) : (
                                    ''
                                )}
                            </Stack>
                        </CardContent>
                    </Card>
                ))}
            </Stack>
            <Pagination
                shape="rounded"
                color="secondary"
                count={Math.ceil(filteredAndSortedModels.length / itemsPerPage)}
                page={pageNumber}
                onChange={(_, value) => setPageNumber(value)}
                style={{
                    marginTop: theme.spacing(4),
                    marginBottom: theme.spacing(12),
                    display: 'flex',
                    justifyContent: 'center',
                }}
            />
        </Container>
    );
};

export default ModelsPage;
