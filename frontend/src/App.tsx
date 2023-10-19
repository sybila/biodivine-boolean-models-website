import './App.css'
import {Route, Routes} from "react-router-dom";
import MainPage from "./pages/MainPage";
import ModelsPage from "./pages/ModelsPage";
import ModelsDetailPage from "./pages/ModelsDetailPage";

function App() {
  return (
      <Routes>
          <Route path="/">
              <Route index element={<MainPage />}/>
              <Route path="models" element={<ModelsPage />}/>
              <Route path="models/:id" element={<ModelsDetailPage />}/>
          </Route>
      </Routes>
  )
}

export default App
