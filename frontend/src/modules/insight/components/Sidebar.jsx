import {
  BarChart,
  Calendar,
  Home,
  Settings,
  Users,
  LineChart,
} from "lucide-react";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "modules/shared/components/ui/avatar";
import { Link, useLocation } from "react-router-dom";
import { cn } from "modules/shared/lib/utils";
import { useContext } from "react";
import { AuthContext } from "modules/shared/contexts/AuthContext";
import { formatUserName } from "modules/shared/utils/formatUsername";

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { user } = useContext(AuthContext);

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
      path: "/insights/dashboard",
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
      <div className="ml-2 flex items-center justify-between border-b border-border bg-menu p-4">
        <Link to="/insights" className="flex items-center space-x-2">
          <img
            src={"/logo.png"}
            alt="Claro Insights"
            width={"28"}
            height={"28"}
            className="mr-1"
            draggable={false}
          />
          <span className="pointer-events-none text-2xl font-semibold text-menu-foreground opacity-90">
            Claro Insight
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
              <AvatarImage src={user.avatar} alt="@usuario" />
              <AvatarFallback className="bg-secondary text-accent">
                {user.userName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-foreground">
                {formatUserName(user.userName)}
              </span>
              <span className="text-xs text-foreground">Gestão</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
