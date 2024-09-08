import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Layout from "../utils/Layout";
import Dashboard from "../pages/Dashboard";
import Groups from "../pages/Groups";
import Friends from "../pages/Friends";
import Login from "../pages/Login";
import Signup from "../pages/Signup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="friends" element={<Friends />} />
          <Route path="groups" element={<Groups />} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
