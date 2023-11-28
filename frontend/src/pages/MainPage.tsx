import React from 'react';
import {Link} from "react-router-dom";

const MainPage: React.FC = () => {
    return (
        <>
            <div className="page__header">
                <h1 className="page__title"><span className="page__subtitle">Model Repository/</span>BIODIVINE</h1>
                <Link to="/models"><button className="page__button">Model Repository</button></Link>
            </div>
            <div className="page__content">
                <h2 className="page__content-title">Biodivine Boolean Models (BBM) Benchmark Dataset</h2>
                <p><b>What is this?</b> BBM is a collection of Boolean models (Boolean networks) used in systems biology.
                    It aims to be a comprehensive collection suitable for benchmarking and testing new tools
                    and methods. At the moment, there are 230+ models from major model repositories
                    (GINsim, CellCollective, Biomodels, etc.) or individual publications.
                    Additionally, the repository is configured to automatically check integrity of all models
                    and generate different model formats for different tools.
                </p>
                <p>Note that this is <b>not</b> a biological database. Each model has a link to the original source
                    where you can find more biologically relevant data. However,
                    we do not aim to preserve or categorise this additional information in any way.
                </p>
                <p>If you want to learn more, you can read our&nbsp;
                    <a className="page__link" href="https://github.com/sybila/biodivine-boolean-models/blob/main/report/report.pdf">
                         technical report</a>.
                </p>
                <p><b>Where are the models?</b> If you just need individual models, you can head to the <span className="code">./models</span>
                    &nbsp;directory where each model has a subdirectory containing <span className="page__code">bnet</span> / <span className="page__code">aeon</span> /&nbsp;
                    <span className="page__code">sbml</span> source files as well as JSON metadata file and a human-friendly readme.
                    There is also a <span className="page__code">models/summary.csv</span> file with the full list of models. Alternatively,
                    you can download one of the "edition archives" in the <a className="page__link"
                        href="https://github.com/sybila/biodivine-boolean-models/releases">repository releases</a>.
                    These contain the same model files as the <span className="page__code">./models</span> directory,
                    but are grouped by model format and exported as a single directory, so they are easier to
                    digest by scripts or programs.
                </p>
                <div className="main-page__note">
                    <p className="main-page__note-text">Note on model inputs (source nodes): By default, all inputs
                        (entities with no incoming regulations) are represented as "free" variables
                        (i.e. their update function is omitted). However, this is not supported by all tools.
                        If you need to, you can change this input representation when generating a custom "edition"
                        of the dataset (see below).
                    </p>
                </div>
                <div className="main-page__note">
                    <p className="main-page__note-text">Note on multivalued models: The dataset also includes
                        Booleanized versions of multi-valued models. If you wish to exclude these,
                        they can be identified using the keyword <span className="page__code">multi-valued</span>.
                    </p>
                </div>
                <h3 className="page__content-subtitle">Citation</h3>
                <p>If you found this dataset useful in your academic work, you can cite the&nbsp;
                    <a className="page__link" href="https://www.biorxiv.org/content/10.1101/2023.06.12.544361v1">technical report</a>:
                </p>
                <div className="page__code-block">
                    <p className="page__code-block-text">
                        Repository of logically consistent real-world Boolean network models<br/>
                        Samuel Pastva, David Safranek, and others<br/>
                        bioRxiv 2023.06.12.544361; doi: https://doi.org/10.1101/2023.06.12.544361
                    </p>
                </div>
                <h3 className="page__content-subtitle">Custom Model Editions</h3>
                <p>
                    If you need to generate models with specific properties (or formats), you can use
                    <span className="page__code">bundle.py</span> to generate custom model editions. In particular,
                    for each edition you can pick the desired format
                    (<span className="page__code">bnet</span>/<span className="page__code">aeon</span>/<span className="page__code">sbml</span>),
                    desired input representation (<span className="page__code">free</span>, constant <span className="page__code">true</span>
                    or <span className="page__code">false</span> , random, or the <span className="page__code">identity</span> function),
                    and you can filter the models using a Python expression (e.g. you want to only include models with specific keywords or size).
                </p>
                <div className="main-page__note">
                    <p className="main-page__note-text">
                        Random input valuations: If you select <span className="page__code">random</span> input values,
                        you'll be given the option to specify how many samples should be taken for each model
                        (assuming the model has enough valuations). Each sample is unique and is saved
                        as an individual model file. Furthermore, you will be able to select what random seed
                        should be used to initialize the generator for each model. As such, the process
                        should be fully reproducible.
                    </p>
                </div>
                <p>
                    Once you have <a className="page__link" href="https://github.com/sybila/biodivine-aeon-py">AEON.py</a> installed
                    (<span className="page__code">pip install -r requirements.txt</span>), you can simply run
                    <span className="page__code">python3 bundle.py</span> and answer the script prompts with your
                    desired specification. For inspiration, here are several filter expression that can be useful for
                    generating custom editions:
                </p>
                <div className="page__code-block">
                    <p className="page__code-block-text">
                        # Models with at least 10 variables and 5 inputs:<br/>
                        len(variables) {'<'} 10 and len(inputs) {'>'} 5<br/>
                        # Models that are on GINsim but not on CellCollective:<br/>
                        'ginsim' in metadata['keywords'] and not 'cellcollective' in metadata['keywords']<br/>
                        # Models with variable ERK that are originally multi-valued.<br/>
                        'ERK' in variables and 'multi-valued' in metadata['keywords']
                    </p>
                </div>
                <h3 className="page__content-subtitle">Contributing</h3>
                <p>
                    We accept new models and improvements through issues and pull request. In&nbsp;
                    <a className="page__link" href="https://github.com/sybila/biodivine-boolean-models/blob/main/CONTRIBUTING.md">CONTRIBUTING.md</a>,
                    you can find how to let us know about a new model through an issue or a pull request.
                </p>
                <h3 className="page__content-subtitle">Random Networks</h3>
                <p>
                    Currently, we only accept networks that have a demonstrated relationship with some biological system.
                    However, we do not assume any specific level of curation---the models can be hand made,
                    inferred from data, or anything in between. This rules out randomly generated models though.
                    If you would also like to test your tool on randomly generated networks, we can recommend&nbsp;
                    <a className="page__link" href="https://zenodo.org/record/3714876#.YxXVYi8Rr0o">this</a> or&nbsp;
                    <a className="page__link" href="https://github.com/daemontus/artifact_cav2021/tree/master/benchmarks_random">this&nbsp;</a>
                    dataset (and the associated network generators).
                </p>
                <h3 className="page__content-subtitle">Unresolved Issues</h3>
                <p>
                    When working with the dataset, you may want to consider the following limitations:
                </p>
                <div>
                    <ul>
                        <li>GINsim model export automatically "hides" some logical errors in models
                            (<a className="page__link" href="(https://github.com/sybila/biodivine-boolean-models/issues/57)">Issue 57</a>).</li>
                        <li>Regulatory network data is unavailable for <span className="page__code">.bnet</span> models
                            (<a className="page__link" href="https://github.com/sybila/biodivine-boolean-models/issues/61">Issue 61</a>).</li>
                        <li>Extra metadata available in <span className="page__code">.sbml</span> models is erased by the static analysis workflow
                            (<a className="page__link" href="https://github.com/sybila/biodivine-boolean-models/issues/60">Issue 60</a>).</li>
                        <li>In the future, we may incorporate more structural metadata; SCCs of the regulatory graph,
                            feedback vertex set, positive/negative edges, etc.
                            (<a className="page__link" href="https://github.com/sybila/biodivine-boolean-models/issues/59">Issue 59</a>).</li>
                    </ul>
                </div>
                <div className="main-page__note">
                    <p className="main-page__note-text">
                        Copyright of all models belongs to their respective authors and/or publishers.
                        All other information is provided as is for free reproduction.
                    </p>
                </div>
                <Link to="/models"><button className="page__button">Learn More</button></Link>
            </div>
        </>
    )
};

export default MainPage;
