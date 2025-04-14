// Insights.jsx
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Dashboard from "./Dashboard";
import TeamPage from "./TeamsPage";
import AnalyticsPage from "./AnalyticsPage";
import VacationsPage from "./VacationsPage";
import SettingsPage from "./SettingsPage";
import Container from "modules/shared/components/ui/container";
import { Button } from "modules/shared/components/ui/button";
import { Menu as MenuIcon, X as XIcon } from "lucide-react";

export default function Insights() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const renderActivePage = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "team":
        return <TeamPage />;
      case "analytics":
        return <AnalyticsPage />;
      case "vacations":
        return <VacationsPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    // A área principal desconta a altura de header e footer (4rem)
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Menu móvel: exibido apenas em telas pequenas */}
      <div
        className={`${
          mobileSidebarOpen ? "block" : "hidden"
        } absolute inset-0 z-40 md:hidden`}
      >
        {/* Overlay para fechar o menu */}
        <div
          className="fixed inset-0 bg-black opacity-50"
          onClick={() => setMobileSidebarOpen(false)}
        ></div>
        <div className="relative flex h-full w-64 flex-col bg-menu">
          <div className="flex justify-end p-4">
            <Button onClick={() => setMobileSidebarOpen(false)}>
              <XIcon className="h-4 w-4" />
            </Button>
          </div>
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>

      {/* Sidebar fixa para desktop */}
      <div className="hidden md:flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Conteúdo principal */}
      <div className="flex flex-1 flex-col">
        {/* Cabeçalho móvel (apenas em telas pequenas) */}
        <div className="flex items-center justify-between bg-menu p-4 md:hidden">
          <Button onClick={() => setMobileSidebarOpen(true)}>
            <MenuIcon className="h-4 w-4" />
          </Button>
          <h1 className="text-lg text-white">Dashboard</h1>
        </div>

        {/* Área de conteúdo com scroll, utilizando o Container original */}
        <div className="flex-1 overflow-auto">
          <Container innerClassName="mx-0">{renderActivePage()}</Container>
        </div>
      </div>
    </div>
  );
}
