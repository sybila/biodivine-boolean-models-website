import { CircularProgress } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ModelViewer from '../components/ModelViewer';
import { ModelsApi } from '../services';
import { parseModifications } from '../utils/stringUtils';

const ModelsDetailPage = () => {
    const { id } = useParams();
    const [fileData, setFileData] = useState<string>('');
    const [modifications, setModifications] = useState<string>('');
    const { data: model, isLoading } = useQuery({
        queryKey: ['model', id],
        queryFn: () => ModelsApi.getSpecific(id!),
        gcTime: 0,
    });

    const openInNewTab = () => {
        // Replace 'your-component-url' with the actual URL of the component you want to open in a new tab.
        window.open(`/models/${model?.id}/modelView`, '_blank');
    };

    useEffect(() => {
        const data = model?.modelData;
        if (data) {
            try {
                const tmp = new Uint8Array((data as unknown as { type: string; data: number[] }).data);
                const dataString = new TextDecoder('utf-8').decode(tmp);
                setFileData(dataString);
            } catch (e) {
                console.error('error converting', e);
            }
        }

        const notes = model?.notes;
        if (notes) {
            setModifications(parseModifications(notes));
        }
    }, [model]);

    return (
        <>
            <div className="page__header">
                <h1 className="page__title">
                    <span className="page__subtitle">Model Repository/</span>BIODIVINE
                </h1>
                <Link to="/models">
                    <button className="page__button">Back To Model Repository</button>
                </Link>
            </div>
            <div className="page__content">
                {isLoading ? (
                    <CircularProgress />
                ) : (
                    <>
                        <h2 className="page__content-title">{model?.name}</h2>
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
                                                {model?.urlModel.map((source) => (
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
                        <div dangerouslySetInnerHTML={{ __html: modifications }}></div>
                        <h3 className="page__content-subtitle">Model Citation</h3>
                        <div className="page__code-block">
                            <p className="details-page__bib-text" style={{ whiteSpace: 'pre-wrap' }}>
                                {model?.bib}
                            </p>
                        </div>
                        <h3 className="page__content-subtitle">Model Viewer</h3>
                        <div className="details-page__model-viewer">
                            <ModelViewer modelData={fileData} />
                        </div>
                        <div className="details-page__mobile-model-viewer">
                            <button className="page__button details-page__newTab-button" onClick={openInNewTab}>
                                Open model view in new tab
                            </button>
                        </div>

                        <Link to="/models">
                            <button className="page__button">Go back to models page</button>
                        </Link>
                    </>
                )}
            </div>
        </>
    );
};

export default ModelsDetailPage;
