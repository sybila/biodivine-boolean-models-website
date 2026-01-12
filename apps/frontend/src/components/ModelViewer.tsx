import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import * as ModelsApi from '../BbmApiService.ts';
import { show_model } from './scripts/model-view.js';

interface ModelViewerProps {
    modelId?: number;
}

/**
 * Model viewer is a wrapper around the "old school" AEON graph component which is currently in the `scripts`
 * directory. You give it a model ID, and it will then fetch the model data and display it in a cytoscape viewer.
 */
const ModelViewer = ({ modelId }: ModelViewerProps) => {
    const modelView = useRef<HTMLDivElement | null>(null);

    const { data: modelData } = useQuery({
        queryKey: ['modelData'],
        queryFn: () => ModelsApi.getAeonData((modelId ?? 0).toString()),
        gcTime: 0,
    });

    useEffect(() => {
        if (modelData === undefined) return;
        if (modelView.current === null) return;
        show_model(modelView.current, modelData);
    }, [modelData]);

    return (
        <div className="model-viewer__container">
            <div className="model-viewer__view" ref={modelView}></div>
        </div>
    );
};

export default ModelViewer;
