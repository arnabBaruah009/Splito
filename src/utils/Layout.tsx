import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const Layout = () => {
  return (
    <div className="w-screen h-screen grid grid-rows-[auto_1fr]">
      <Navbar />
      <section className="flex">
        <Sidebar />
        <Outlet />
      </section>
    </div>
  );
};

export default Layout;
