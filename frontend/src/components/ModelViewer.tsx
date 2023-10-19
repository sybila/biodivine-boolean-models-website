import React, { useEffect } from 'react';
// @ts-ignore - js/ts type problem
import {show_model} from './scripts/model-view.js';

type ModelViewerProps = {
    modelData: string;
};
const ModelViewer: React.FC<ModelViewerProps> = ({modelData}) => {
    useEffect(() => {
        const init = () => {
            let container = document.getElementById("model-view");

            show_model(container, modelData);
        }

        init();
    }, []);

    return (
        <div style={{ width: '800px', height: '550px', margin: '0 auto', textAlign: 'left' }}>
            <div id="model-view" style={{ width: '800px', height: '550px', borderRadius: '20px', border: '2px solid black' }}></div>
        </div>
    );
};

export default ModelViewer;
