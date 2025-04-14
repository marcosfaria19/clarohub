import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Dashboard from "./Dashboard";
import TeamPage from "./TeamsPage";
import AnalyticsPage from "./AnalyticsPage";
import VacationsPage from "./VacationsPage";
import SettingsPage from "./SettingsPage";
import Container from "modules/shared/components/ui/container";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "modules/shared/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "modules/shared/components/ui/button";

export default function Insights() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isOpen, setIsOpen] = useState(false);

  // Mapeamento dos rótulos para cada aba
  const tabLabels = {
    dashboard: "Dashboard",
    team: "Equipe",
    analytics: "Análise",
    vacations: "Férias",
    settings: "Configurações",
  };

  const activeTabLabel = tabLabels[activeTab] || "Dashboard";

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
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar fixa para desktop */}
      <div className="hidden md:block">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Botão de menu para mobile */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <div className="fixed left-0 top-16 z-10 w-full bg-background p-2 shadow-sm md:hidden">
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Menu size={20} />
              {activeTabLabel}
            </Button>
          </SheetTrigger>
        </div>
        <SheetContent side="left" className="select-none bg-background p-0">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={(tab) => {
              setActiveTab(tab);
              setIsOpen(false);
            }}
          />
        </SheetContent>
      </Sheet>

      {/* Conteúdo principal */}
      <div className="flex-1 md:pl-64 md:pt-0">
        <Container
          fullWidth
          innerClassName="mx-0 px-4 sm:px-6 md:px-8 lg:px-12"
        >
          <div className="py-6">{renderActivePage()}</div>
        </Container>
      </div>
    </div>
  );
}
