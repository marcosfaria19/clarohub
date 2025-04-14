import {
  HomeIcon,
  UsersIcon,
  BarChart3Icon,
  CalendarIcon,
  SettingsIcon,
} from "lucide-react";
import { Button } from "modules/shared/components/ui/button";

import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "modules/shared/components/ui/avatar";
import { Link } from "react-router-dom";

const Sidebar = ({ activeTab, setActiveTab, onLogout }) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: HomeIcon },
    { id: "team", label: "Equipe", icon: UsersIcon },
    { id: "analytics", label: "Análise", icon: BarChart3Icon },
    { id: "vacations", label: "Férias", icon: CalendarIcon },
    { id: "settings", label: "Configurações", icon: SettingsIcon },
  ];

  return (
    <div className="flex h-full flex-col bg-menu md:fixed md:bottom-0 md:left-0 md:top-0 md:w-64 md:border-r md:border-border">
      {/* Logo */}
      <div className="flex items-center justify-between border-b border-border bg-menu p-4">
        <Link to="/home" className="flex items-center space-x-2">
          <img
            src={"/logo.png"}
            alt="Claro Hub"
            width={"28"}
            height={"28"}
            className="mr-1"
            draggable={false}
          />
          <span className="pointer-events-none text-2xl font-semibold text-menu-foreground opacity-90">
            Claro Hub
          </span>
        </Link>
      </div>
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
        <div className="mt-4 flex flex-col space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src="/placeholder.svg?height=32&width=32"
                alt="User avatar"
              />
              <AvatarFallback className="bg-secondary text-accent">
                M
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-foreground">
                Marcos Faria
              </span>
              <span className="text-xs text-foreground">Gerente</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
