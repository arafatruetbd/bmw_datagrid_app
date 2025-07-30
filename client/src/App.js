import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DataGridPage from "./pages/DataGridPage";
import DetailPage from "./pages/DetailPage";
import NotFoundPage from "./pages/NotFoundPage"; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DataGridPage />} />
        <Route path="/detail/:id" element={<DetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
