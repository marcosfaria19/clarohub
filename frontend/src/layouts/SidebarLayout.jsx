import { Outlet } from "react-router-dom";
import Footer from "../modules/shared/components/Footer";
import Sidebar from "../modules/insight/components/Sidebar";

const SidebarLayout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <main className="flex-1 p-4">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default SidebarLayout;
