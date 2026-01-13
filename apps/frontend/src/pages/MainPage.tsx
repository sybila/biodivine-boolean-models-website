import FolderIcon from '@mui/icons-material/Folder';
import { Button, Container, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { AEON_BUTTON, H1_HEADER, H1_HEADER_EMPHASIS, H2_PAGE_TITLE } from '../styles.ts';

const MainPage = () => {
    const theme = useTheme();
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
                    endIcon={<FolderIcon />}
                >
                    Model repository
                </Button>
            </Stack>
            <div
                className="markdown-styled"
                style={{ marginLeft: theme.spacing(2), marginRight: theme.spacing(2), marginBottom: theme.spacing(12) }}
            >
                <h2 style={H2_PAGE_TITLE}>Biodivine Boolean Models (BBM) Benchmark Dataset</h2>
                <p>
                    <b>What is this?</b> BBM is a collection of Boolean models (Boolean networks) used in systems
                    biology. It aims to be a comprehensive collection suitable for benchmarking and testing new tools
                    and methods. At the moment, there are 280+ models from major model repositories (GINsim,
                    CellCollective, Biomodels, etc.) or individual publications. Additionally, the repository is
                    configured to automatically check integrity of all models and generate different model formats for
                    different tools.
                </p>
                <p>
                    Note that this is <b>not</b> a biological database. Each model has a link to the original source
                    where you can find more biologically relevant data. However, we do not aim to preserve or categorise
                    this additional information in any way.
                </p>
                <p>
                    If you want to learn more, you can read our&nbsp;
                    <a
                        href="https://github.com/sybila/biodivine-boolean-models/blob/main/report/report.pdf"
                        target="_blank"
                        rel="noreferrer"
                    >
                        technical report
                    </a>
                    .
                </p>
                <p>
                    <b>Where are the models?</b> If you just want to browse the model list, click the{' '}
                    <b>Model Repository</b> button at the top of the page. If you need individual model files, you can
                    head to the <code>./models</code>
                    &nbsp;directory in our{' '}
                    <a href="https://github.com/sybila/biodivine-boolean-models" target="_blank" rel="noreferrer">
                        Github repository
                    </a>{' '}
                    where each model has a subdirectory containing <code>bnet</code> / <code>aeon</code> /&nbsp;
                    <code>sbml</code> /&nbsp;<code>booleannet</code>/&nbsp;<code>bma</code> source files as well as JSON
                    metadata file and a human-friendly readme. There is also a <code>models/summary.csv</code> file with
                    the full list of models. Alternatively, you can download one of the &quot;edition archives&quot; in
                    the{' '}
                    <a
                        href="https://github.com/sybila/biodivine-boolean-models/releases"
                        target="_blank"
                        rel="noreferrer"
                    >
                        repository release section
                    </a>
                    . These contain the same model files as the <code>./models</code> directory, but are grouped by
                    model format and exported as a single directory, so they are easier to digest by scripts or
                    programs.
                </p>
                <div className="note">
                    <p className="note-text">
                        Note on model inputs (source nodes): By default, all inputs (entities with no incoming
                        regulations) are represented as &quot;free&quot; variables (i.e. their update function is
                        omitted). However, this is not supported by all tools. If you need to, you can change this input
                        representation when generating a custom &quot;edition&quot; of the dataset (see below).
                    </p>
                </div>
                <div className="note">
                    <p className="note-text">
                        Note on multivalued models: The dataset also includes Booleanized versions of multi-valued
                        models. If you wish to exclude these, they can be identified using the keyword{' '}
                        <code>multi-valued</code>.
                    </p>
                </div>
                <div className="note">
                    <p className="note-text">
                        Copyright of all models belongs to their respective authors and/or publishers. All other
                        information is provided as is for free reproduction.
                    </p>
                </div>
                <h3 className="page__content-subtitle">Citation</h3>
                <p>
                    If you found this dataset useful in your academic work, you can cite the&nbsp;
                    <a className="page__link" href="https://www.biorxiv.org/content/10.1101/2023.06.12.544361v1">
                        technical report
                    </a>
                    :
                </p>
                <div className="code-block">
                    <p className="bib-text">
                        Repository of logically consistent real-world Boolean network models
                        <br />
                        Samuel Pastva, David Safranek, and others
                        <br />
                        bioRxiv 2023.06.12.544361; doi: https://doi.org/10.1101/2023.06.12.544361
                    </p>
                </div>
                <h3 className="page__content-subtitle">Custom Model Editions</h3>
                <p>
                    If you need to generate models with specific properties (or formats), you can use the{' '}
                    <code>bundle.py</code> script to generate custom model editions (see the code repository for
                    details). In particular, for each edition you can pick the desired format (<code>bnet</code>/
                    <code>aeon</code>/<code>sbml</code>/<code>booleannet</code>/<code>bma</code>), desired input
                    representation (<code>free</code>, constant <code>true</code> or <code>false</code> ,
                    <code>random</code>, or the <code>identity</code> function), and you can filter the models using a
                    Python expression (e.g. you want to only include models with specific keywords or size).
                </p>
                <h3 className="page__content-subtitle">Contributing</h3>
                <p>
                    We accept new models and improvements through issues and pull request. In&nbsp;
                    <a
                        href="https://github.com/sybila/biodivine-boolean-models/blob/main/CONTRIBUTING.md"
                        target="_blank"
                        rel="noreferrer"
                    >
                        CONTRIBUTING.md
                    </a>
                    , you can find how to let us know about a new model through an issue or a pull request.
                </p>
                <h3 className="page__content-subtitle">Random Networks</h3>
                <p>
                    Currently, we only accept networks that have a demonstrated relationship with some biological
                    system. However, we do not assume any specific level of curation---the models can be hand made,
                    inferred from data, or anything in between. This rules out randomly generated models though. If you
                    would also like to test your tool on randomly generated networks, we can recommend&nbsp;
                    <a href="https://zenodo.org/record/3714876#.YxXVYi8Rr0o" target="_blank" rel="noreferrer">
                        this
                    </a>{' '}
                    or&nbsp;
                    <a
                        href="https://github.com/daemontus/artifact_cav2021/tree/master/benchmarks_random"
                        target="_blank"
                        rel="noreferrer"
                    >
                        this&nbsp;
                    </a>
                    dataset (and the associated network generators).
                </p>

                <Button
                    component={Link}
                    to="/models"
                    variant="contained"
                    disableElevation
                    sx={AEON_BUTTON}
                    endIcon={<FolderIcon />}
                >
                    Go to model repository
                </Button>
            </div>
        </Container>
    );
};

export default MainPage;
