import React from 'react';
import {Link, useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {ModelsApi} from "../services";
import ModelViewer from "../components/ModelViewer";

const ModelsDetailPage: React.FC = () => {
    const { id } = useParams();

    const { data: model } = useQuery({
        queryKey: ['model'],
        queryFn: () => ModelsApi.getSpecific(id!)
    });

    //console.log(model)

    const fileData = model?.modelData;

    //console.log("type:", typeof fileData);
    //console.log("fileData:", fileData);

    let dataString = '';

    if (fileData) {
        try {
            const tmp = new Uint8Array((fileData as unknown as {type: string, data: number[]}).data); //stupid JS bug
            dataString = new TextDecoder('utf-8').decode(tmp)
        } catch (e) {
            console.error("error converting", e);
        }
    }

    // Split the notes by lines
    const lines = model?.notes.split('\n').filter(Boolean);

    // Initialize variables for the HTML elements
    let formattedMarkup = '';
    let inUl = false;

    if (lines) {
        for (let line of lines) {
            if (line.startsWith('### ')) {
                // Extract the h3 content
                const h3 = line.substring(4);
                formattedMarkup += `<h3>${h3}</h3>`;
            } else if (line.startsWith(' - ')) {
                if (!inUl) {
                    formattedMarkup += `<ul>`;
                    inUl = true;
                }
                // Use a regular expression to match and extract the quoted parts
                const quotedParts = line.match(/`[^`]+`/g);
                if (quotedParts) {
                    // Replace the quoted parts with span tags
                    let listItem = line.substring(2);
                    for (const part of quotedParts) {
                        const textInsideQuotes = part.slice(1, -1);
                        listItem = listItem.replace(
                            part,
                            `<b>${textInsideQuotes}</b>`);
                    }
                    formattedMarkup += `<li>${listItem}</li>`
                } else {
                    formattedMarkup += `<li>${line.substring(2)}</li>`;
                }
            } else {
                if (inUl) {
                    formattedMarkup += `</ul>`
                    inUl = false;
                }
                // Extract the content for the <p> element
                const quotedPartsInP = line.match(/`[^`]+`/g);
                if (quotedPartsInP) {
                    let pContent = line;
                    for (const part of quotedPartsInP) {
                        const textInsideQuotes = part.slice(1, -1);
                        pContent = pContent.replace(
                            part,
                            `<b>${textInsideQuotes}</b>`
                        );
                    }
                    formattedMarkup += `<p>${pContent}</p>`;
                } else {
                    formattedMarkup += `<p>${line}</p>`;
                }
            }
        }
    }

    return (
        <>
            <div className="header">
                <h1 className="title"><span className="subtitle">Model Repository/</span>BIODIVINE</h1>
                <Link to="/models"><button>Back To Model Repository</button></Link>
            </div>
            <div className="content">
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
                <div dangerouslySetInnerHTML={{ __html: formattedMarkup}}></div>
                <h3>Model Citation</h3>
                <div className="code_block">
                    <p className="bib_text" style={{ whiteSpace: 'pre-wrap' }}>
                        {model?.bib}
                    </p>
                </div>
                <h3>Model Viewer</h3>
                <ModelViewer modelData={dataString}/>
                <Link to="/models"><button>Go back to models page</button></Link>
            </div>
        </>
    )
};

export default ModelsDetailPage;
