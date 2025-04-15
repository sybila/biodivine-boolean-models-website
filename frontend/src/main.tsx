import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import App from './App.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={new QueryClient()}>
            <RecoilRoot>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </RecoilRoot>
        </QueryClientProvider>
    </React.StrictMode>
);
