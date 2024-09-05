import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const Layout = () => {
  return (
    <div className="w-screen h-screen grid grid-rows-[auto_1fr]">
      <Navbar />
      <section className="flex">
        <Sidebar />
        <div className="p-10 bg-slate-200 flex-grow overflow-y-auto">
          <Outlet />
        </div>
      </section>
    </div>
  );
};

export default Layout;
