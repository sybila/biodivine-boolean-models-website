import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import {RecoilRoot} from "recoil";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <QueryClientProvider client={new QueryClient()}>
          <RecoilRoot>
              <BrowserRouter>
                  <App />
              </BrowserRouter>
          </RecoilRoot>
      </QueryClientProvider>
  </React.StrictMode>,
)
