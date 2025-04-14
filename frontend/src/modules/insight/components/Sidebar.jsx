import {
  HomeIcon,
  UsersIcon,
  BarChart3Icon,
  CalendarIcon,
  SettingsIcon,
} from "lucide-react";
import { Button } from "modules/shared/components/ui/button";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: HomeIcon },
    { id: "team", label: "Equipe", icon: UsersIcon },
    { id: "analytics", label: "Análise", icon: BarChart3Icon },
    { id: "vacations", label: "Férias", icon: CalendarIcon },
    { id: "settings", label: "Configurações", icon: SettingsIcon },
  ];

  return (
    <div className="flex h-screen w-64 flex-col bg-menu">
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <Button
                onClick={() => setActiveTab(item.id)}
                variant={activeTab === item.id ? "default" : "ghost"}
                className={`w-full justify-start ${
                  activeTab === item.id
                    ? "bg-primary text-primary-foreground"
                    : "text-menu-foreground hover:bg-secondary"
                }`}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-border p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
            <img
              src="/placeholder.svg?height=32&width=32"
              alt="User avatar"
              className="h-full w-full rounded-full"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-menu-foreground">
              Marcos Faria
            </p>
            <p className="text-xs text-muted-foreground">Gerente</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
