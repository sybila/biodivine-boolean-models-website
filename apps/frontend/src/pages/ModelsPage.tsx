import ArrowRightIcon from '@mui/icons-material/ArrowCircleRight';
import InfoIcon from '@mui/icons-material/Info';
import { Button, Card, CardContent, Chip, CircularProgress, Container, Pagination, Stack } from '@mui/material';
import { atom, useAtom, useAtomValue } from 'jotai';
import { useEffect } from 'react';
import FilterBar from '../components/FilterBar.tsx';
import { allModelsAtom } from '../state/modelAtoms.ts';
import { selectedKeywordsAtom } from '../state/searchAtoms.ts';
import { sortedModelsAtom } from '../state/sortAtoms.ts';
import { AEON_BUTTON } from '../styles.ts';

/**
 * A "local" atom that is not part of the main global state. It simply defines the page this listing is on and
 * should not really be accessed by other components.
 */
const modelsPageNumberAtom = atom<number>(1);

const ModelsPage = () => {
    // TODO: Error handling.
    const { isLoading, isError } = useAtomValue(allModelsAtom);
    const [pageNumber, setPageNumber] = useAtom(modelsPageNumberAtom);
    const [selectedKeywords, setSelectedKeywords] = useAtom(selectedKeywordsAtom);
    const filteredAndSortedModels = useAtomValue(sortedModelsAtom);
    const numberOfModels = filteredAndSortedModels.length;

    // TODO: Changing filters must reset page number.
    const itemsPerPage = 100;
    const startIndex = (pageNumber - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedModels = filteredAndSortedModels.slice(startIndex, endIndex);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [pageNumber]);

    const toggleKeyword = (keyword: string) => {
        setSelectedKeywords((prevState) => {
            if (prevState.includes(keyword)) {
                return prevState.filter((item) => item !== keyword);
            } else {
                return [...prevState, keyword];
            }
        });
    };

    return (
        <Container maxWidth="lg">
            <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent="space-between"
                sx={{ marginTop: '8rem', marginBottom: '4rem', marginLeft: '16px', marginRight: '16px' }}
            >
                <h1 className="page__title">
                    BIODIVINE<span className="page__subtitle">/Boolean Models</span>
                </h1>
                <Button href="/" variant="contained" disableElevation sx={AEON_BUTTON} endIcon={<InfoIcon />}>
                    About Us
                </Button>
            </Stack>
            <FilterBar />
            <h2 className="page__content-title" style={{ marginLeft: '16px' }}>
                Models List [{numberOfModels}]
            </h2>
            {isLoading || isError ? <CircularProgress /> : ''}
            <Stack direction="column" spacing={4}>
                {paginatedModels?.map(([model, _reasons]) => (
                    <Card
                        sx={{ borderRadius: '1rem', boxShadow: 'none', border: '2px solid var(--black)' }}
                        key={model.id}
                    >
                        <CardContent sx={{ textAlign: 'left' }}>
                            <Stack direction="column" spacing={2}>
                                <Stack direction="row" alignItems="center" justifyContent="space-between">
                                    <h4 className="models-page__item-title">
                                        [{String(model.id).padStart(3, '0')}] {model.name}
                                    </h4>
                                    <Button
                                        href={`/models/${model.id}`}
                                        variant="contained"
                                        disableElevation
                                        sx={AEON_BUTTON}
                                        endIcon={<ArrowRightIcon />}
                                    >
                                        Details
                                    </Button>
                                </Stack>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <b>Keywords:</b>{' '}
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
                                    <p>
                                        <b>Inputs:</b> {model.inputs}
                                    </p>
                                    <p>
                                        <b>Variables:</b> {model.variables}
                                    </p>
                                    <p>
                                        <b>Regulations:</b> {model.regulations}
                                    </p>
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>
                ))}
            </Stack>
            <div>
                <Pagination
                    shape="rounded"
                    color="primary"
                    count={Math.ceil(filteredAndSortedModels.length / itemsPerPage)}
                    page={pageNumber}
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        width: '70vw',
                        margin: '2rem 0 3rem 8.5rem',
                    }}
                    sx={{
                        '& .MuiPaginationItem-page': {
                            backgroundColor: '#3a568c',
                            color: 'white',
                            outline: 'none',
                            '&.Mui-selected': {
                                backgroundColor: '#d05d5d',
                            },
                            '&:hover': {
                                backgroundColor: '#d05d5d',
                                opacity: '.7',
                            },
                        },
                        '@media only screen and (max-width: 767px)': {
                            width: '100vw',
                            margin: '0 auto 1rem auto',
                        },
                    }}
                    onChange={(_, value) => setPageNumber(value)}
                />
            </div>
        </Container>
    );
};

export default ModelsPage;
