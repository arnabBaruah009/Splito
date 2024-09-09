import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Layout from "../utils/Layout";
import Dashboard from "../pages/Dashboard";
import Groups from "../pages/Groups";
import Friends from "../pages/Friends";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import PersistentUser from "../utils/Persistent_User";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={"/login"} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<PersistentUser />}>
          <Route path="/user" element={<Layout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="friends" element={<Friends />} />
            <Route path="groups" element={<Groups />} />
          </Route>
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
