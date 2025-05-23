import {
  BarChart,
  Calendar,
  Home,
  Settings,
  Users,
  LineChart,
  LogOut,
} from "lucide-react";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "modules/shared/components/ui/avatar";
import { Link, useLocation } from "react-router-dom";
import { cn } from "modules/shared/lib/utils";

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      path: "/insights/dashboard",
    },
    {
      id: "team",
      label: "Equipe",
      icon: Users,
      path: "/insights/team",
    },
    {
      id: "analytics",
      label: "Produtividade",
      icon: BarChart,
      path: "/insights/analytics",
    },
    {
      id: "projects",
      label: "Projetos",
      icon: LineChart,
      path: "/insights/projects",
    },
    {
      id: "vacations",
      label: "Férias",
      icon: Calendar,
      path: "/insights/vacations",
    },
    {
      id: "settings",
      label: "Configurações",
      icon: Settings,
      path: "/insights/settings",
    },
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
              <Link
                to={item.path}
                className={cn(
                  "flex h-10 w-full items-center rounded-md px-4 py-2 text-sm font-medium transition-colors",
                  currentPath === item.path ||
                    currentPath.startsWith(`${item.path}/`)
                    ? "bg-primary text-primary-foreground"
                    : "text-menu-foreground hover:bg-secondary",
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Link>
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
