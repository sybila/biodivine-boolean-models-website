import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ModelsApi } from '../services';
// @ts-expect-error - js/ts type problem
import { show_model } from './scripts/model-view.js';

type ModelViewerProps = {
    modelData?: string;
};
const ModelViewer: React.FC<ModelViewerProps> = ({ modelData }) => {
    const { id } = useParams();
    const { data: model } = useQuery({
        queryKey: ['model'],
        queryFn: () => ModelsApi.getSpecific(id!),
        cacheTime: 0,
    });

    useEffect(() => {
        const container = document.getElementById('model-view');
        if (!modelData) {
            let dataString = '';
            const data = model?.modelData;
            if (data) {
                try {
                    const tmp = new Uint8Array((data as unknown as { type: string; data: number[] }).data);
                    dataString = new TextDecoder('utf-8').decode(tmp);
                } catch (e) {
                    console.error('error converting', e);
                }
            }
            show_model(container, dataString);
        } else {
            show_model(container, modelData);
        }
    });

    return (
        <div className="model-viewer__container">
            <div className="model-viewer__view" id="model-view"></div>
        </div>
    );
};

export default ModelViewer;
