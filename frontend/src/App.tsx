import './App.css'
import {Route, Routes} from "react-router-dom";
import MainPage from "./pages/MainPage";
import ModelsPage from "./pages/ModelsPage";
import ModelsDetailPage from "./pages/ModelsDetailPage";
import ModelViewer from "./components/ModelViewer";

function App() {
  return (
      <Routes>
          <Route path="/">
              <Route index element={<MainPage />}/>
              <Route path="models" element={<ModelsPage />}/>
              <Route path="models/:id" element={<ModelsDetailPage />}/>
              <Route path="models/:id/modelView" element={<ModelViewer />}/>
          </Route>
      </Routes>
  )
}

export default App
