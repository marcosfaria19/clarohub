import { Outlet } from "react-router-dom";
import Sidebar from "../modules/insight/components/Sidebar";

const SidebarLayout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col md:pl-64">
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout;
