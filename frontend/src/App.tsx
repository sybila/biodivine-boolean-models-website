import { Route, Routes } from 'react-router-dom';
import './App.css';
import ModelViewer from './components/ModelViewer';
import MainPage from './pages/MainPage';
import ModelsDetailPage from './pages/ModelsDetailPage';
import ModelsPage from './pages/ModelsPage';

function App() {
    return (
        <Routes>
            <Route path="/">
                <Route index element={<MainPage />} />
                <Route path="models" element={<ModelsPage />} />
                <Route path="models/:id" element={<ModelsDetailPage />} />
                <Route
                    path="models/:id/modelView"
                    element={
                        <div className="model-viewer__fullscreen">
                            <ModelViewer />
                        </div>
                    }
                />
            </Route>
        </Routes>
    );
}

export default App;
