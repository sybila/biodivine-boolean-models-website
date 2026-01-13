import FileDownloadIcon from '@mui/icons-material/FileDownload';
import InfoIcon from '@mui/icons-material/Info';
import { Box, Button, CircularProgress, Container, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useQuery } from '@tanstack/react-query';
import { marked } from 'marked';
import { Link, useParams } from 'react-router-dom';
import * as BbmApiService from '../BbmApiService.ts';
import ModelViewer from '../components/ModelViewer.tsx';
import { AEON_BUTTON, H1_HEADER, H1_HEADER_EMPHASIS, H2_PAGE_TITLE } from '../styles.ts';

const ModelsDetailPage = () => {
    const theme = useTheme();
    const { id } = useParams();
    const { data: modelData, isLoading } = useQuery({
        queryKey: ['model', id],
        queryFn: async () => {
            const model = await BbmApiService.getById(id!);
            return { model: model, markdownNotes: await marked.parse(model?.notes ?? '', { async: true }) };
        },
        gcTime: 0,
    });

    const model = modelData ? modelData['model'] : undefined;
    const markdownNotes = modelData ? modelData['markdownNotes'] : undefined;

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
                <Button
                    component={Link}
                    to="/models"
                    variant="contained"
                    disableElevation
                    sx={AEON_BUTTON}
                    endIcon={<InfoIcon />}
                >
                    Back to models
                </Button>
            </Stack>
            <div
                style={{ marginLeft: theme.spacing(2), marginRight: theme.spacing(2), marginBottom: theme.spacing(12) }}
                className="markdown-styled"
            >
                {isLoading ? (
                    <CircularProgress />
                ) : (
                    <>
                        <h2 style={H2_PAGE_TITLE}>{model?.name}</h2>
                        <div>
                            <ul>
                                <li>
                                    <b>Variables</b>: {model?.variables}
                                </li>
                                <li>
                                    <b>Inputs</b>: {model?.inputs}
                                </li>
                                <li>
                                    <b>Regulations</b>: {model?.regulations}
                                </li>
                                <li>
                                    <b>Publication</b>:{' '}
                                    <a className="page__link" href={model?.urlPublication}>
                                        {model?.urlPublication}
                                    </a>
                                </li>
                                <li>
                                    {model?.urlModel.length == 1 ? (
                                        <>
                                            <b>Source</b>:{' '}
                                            <a className="page__link" href={model?.urlModel[0]}>
                                                {model?.urlModel}
                                            </a>
                                        </>
                                    ) : (
                                        <>
                                            <b>Sources</b>:{' '}
                                            <ul>
                                                {model?.urlModel.map((source: string) => (
                                                    <li key={source}>
                                                        <a className="page__link" href={source}>
                                                            {source}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </>
                                    )}
                                </li>
                                <li>
                                    <b>Keywords</b>: {model?.keywords.join(', ')}
                                </li>
                            </ul>
                        </div>
                        <Stack
                            direction="row"
                            sx={{ marginBottom: theme.spacing(4), marginTop: theme.spacing(4) }}
                            spacing={2}
                            justifyContent="center"
                            alignContent="center"
                        >
                            <Button
                                href={BbmApiService.baseURL + BbmApiService.getFileUrl(id ?? '1', 'aeon')}
                                variant="contained"
                                disableElevation
                                sx={AEON_BUTTON}
                                endIcon={<FileDownloadIcon />}
                            >
                                .aeon
                            </Button>
                            <Button
                                href={BbmApiService.baseURL + BbmApiService.getFileUrl(id ?? '1', 'bnet')}
                                variant="contained"
                                disableElevation
                                sx={AEON_BUTTON}
                                endIcon={<FileDownloadIcon />}
                            >
                                .bnet
                            </Button>
                            <Button
                                href={BbmApiService.baseURL + BbmApiService.getFileUrl(id ?? '1', 'sbml')}
                                variant="contained"
                                disableElevation
                                sx={AEON_BUTTON}
                                endIcon={<FileDownloadIcon />}
                            >
                                .sbml
                            </Button>
                            <Button
                                href={BbmApiService.baseURL + BbmApiService.getFileUrl(id ?? '1', 'booleannet')}
                                variant="contained"
                                disableElevation
                                sx={AEON_BUTTON}
                                endIcon={<FileDownloadIcon />}
                            >
                                .booleannet
                            </Button>
                            <Button
                                href={BbmApiService.baseURL + BbmApiService.getFileUrl(id ?? '1', 'bma')}
                                variant="contained"
                                disableElevation
                                sx={AEON_BUTTON}
                                endIcon={<FileDownloadIcon />}
                            >
                                .bma.json
                            </Button>
                        </Stack>
                        <h3>Model Citation</h3>
                        <div className="code-block">
                            <p className="bib-text" style={{ whiteSpace: 'pre-wrap' }}>
                                {model?.bib}
                            </p>
                        </div>
                        <div dangerouslySetInnerHTML={{ __html: markdownNotes ?? '' }}></div>
                        <Box sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}>
                            <h3>Model Viewer</h3>
                            <ModelViewer modelId={model?.id} />
                        </Box>

                        <Button
                            component={Link}
                            to="/models"
                            variant="contained"
                            disableElevation
                            sx={{ marginTop: theme.spacing(4), ...AEON_BUTTON }}
                            endIcon={<InfoIcon />}
                        >
                            Back to models
                        </Button>
                    </>
                )}
            </div>
        </Container>
    );
};

export default ModelsDetailPage;
