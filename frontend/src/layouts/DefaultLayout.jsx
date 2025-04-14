import { Outlet } from "react-router-dom";
import Header from "../modules/shared/components/Header";
import Footer from "../modules/shared/components/Footer";

const DefaultLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default DefaultLayout;
