import React, {useEffect, useState} from 'react';
import {Link, useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {ModelsApi} from "../services";
import ModelViewer from "../components/ModelViewer";
import {parseModifications} from "../utils/stringUtils";
import { CircularProgress } from '@mui/material';

const ModelsDetailPage: React.FC = () => {
    const { id } = useParams();
    const [fileData, setFileData] = useState<string>('');
    const [modifications, setModifications] = useState<string>('');
    const { data: model, isLoading } = useQuery({
        queryKey: ['model'],
        queryFn: () => ModelsApi.getSpecific(id!),
        cacheTime: 0
    });

    const openInNewTab = () => {
        // Replace 'your-component-url' with the actual URL of the component you want to open in a new tab.
        window.open(`/models/${model?.id}/modelView`, '_blank');
    };

    useEffect(() => {
            const data = model?.modelData;
            if (data) {
                try {
                    const tmp = new Uint8Array((data as unknown as {type: string, data: number[]}).data);
                    const dataString = new TextDecoder('utf-8').decode(tmp);
                    setFileData(dataString);
                } catch (e) {
                    console.error("error converting", e);
                }
            }

            const notes = model?.notes;
            if (notes) {
                setModifications(parseModifications(notes))
            }
    }, [model]);

    return (
        <>
            <div className="header">
                <h1 className="title"><span className="subtitle">Model Repository/</span>BIODIVINE</h1>
                <Link to="/models"><button>Back To Model Repository</button></Link>
            </div>
            <div className="content">
                {isLoading ? (
                    <CircularProgress />
                ) : (
                    <>
                        <h2>{model?.name}</h2>
                        <div>
                            <ul>
                                <li><b>Variables</b>: {model?.variables}</li>
                                <li><b>Inputs</b>: {model?.inputs}</li>
                                <li><b>Regulations</b>: {model?.regulations}</li>
                                <li><b>Publication</b>: <a href={model?.urlPublication}>{model?.urlPublication}</a></li>
                                <li><b>Source</b>: <a href={model?.urlModel}>{model?.urlModel}</a></li>
                                <li><b>Keywords</b>: {model?.keywords.join(', ')}</li>
                            </ul>
                        </div>
                        <div dangerouslySetInnerHTML={{ __html: modifications}}></div>
                        <h3>Model Citation</h3>
                        <div className="code_block">
                            <p className="bib_text" style={{ whiteSpace: 'pre-wrap' }}>
                                {model!.bib}
                            </p>
                        </div>
                        <h3>Model Viewer</h3>
                        <div className="modelViewerComponent">
                            <ModelViewer modelData={fileData} />
                        </div>
                        <div className="mobileViewerComponent">
                            <button className="newTab_button" onClick={openInNewTab}>Open model view in new tab</button>
                        </div>

                        <Link to="/models"><button>Go back to models page</button></Link>
                    </>
                )}
            </div>
        </>
    )
};

export default ModelsDetailPage;
