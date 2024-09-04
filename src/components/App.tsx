import { BrowserRouter, Route, Routes } from "react-router-dom";

import Layout from "../utils/Layout";
import Dashboard from "../pages/Dashboard";
import Groups from "../pages/Groups";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="groups" element={<Groups />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
