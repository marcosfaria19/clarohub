import React, { useContext } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "modules/shared/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "modules/shared/components/ui/sheet";
import {
  MenuIcon,
  LogOut,
  Sun,
  Moon,
  UserIcon,
  SettingsIcon,
  HelpCircleIcon,
} from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "modules/shared/components/ui/avatar";
import AvatarDropdown from "modules/shared/components/AvatarDropdown";
import NotificationsPopover from "modules/shared/components/NotificationsPopover";
import { formatUserName } from "modules/shared/utils/formatUsername";
import { AuthContext } from "modules/shared/contexts/AuthContext";
import { useTheme } from "modules/shared/contexts/ThemeContext";
import appHeaderInfo from "../utils/appHeaderInfo";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const onLogout = () => {
    logout();
  };

  const currentApp = appHeaderInfo[location.pathname] || {
    name: "Claro Hub",
    icon: "icons/claro.png",
    width: 28,
    height: 28,
  };

  return (
    <header className="fixed z-40 mr-0 w-screen select-none bg-menu text-menu-foreground opacity-90">
      <div className="container flex items-center justify-between px-4 py-2 sm:max-w-[1800px]">
        <Link
          to="/home"
          className="flex items-center space-x-2 focus:outline-none"
        >
          <img
            src={`${currentApp.icon}`}
            alt="Claro Hub"
            width={`${currentApp.width}`}
            height={`${currentApp.height}`}
            className="mr-1"
            draggable={false}
          />
          <span className="pointer-events-none text-2xl font-semibold">
            {currentApp.name}
          </span>
        </Link>

        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme} // Chama a função de alternar tema do contexto
            className="text-menu-foreground"
            aria-label={`Alternar para modo ${theme === "dark" ? "claro" : "escuro"}`}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          <NotificationsPopover />

          {user && (
            <>
              <span className="hidden text-menu-foreground/80 lg:inline-block">
                Bem-vindo(a),{" "}
                <span className="font-semibold text-menu-foreground">
                  {formatUserName(user.userName)}
                </span>
              </span>

              <div className="hidden md:block">
                <AvatarDropdown
                  userId={user.userId}
                  onLogout={onLogout}
                  login={user.login}
                  userName={formatUserName(user.userName)}
                />
              </div>

              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-menu-foreground md:hidden"
                  >
                    <MenuIcon className="h-6 w-6" />
                    <span className="sr-only">Abrir menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="select-none bg-background"
                >
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
                        <span className="text-xs text-foreground">
                          {user.login}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-foreground"
                    >
                      <UserIcon className="mr-2 h-4 w-4" />
                      Perfil
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-foreground"
                    >
                      <SettingsIcon className="mr-2 h-4 w-4" />
                      Configurações
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-foreground"
                    >
                      <HelpCircleIcon className="mr-2 h-4 w-4" />
                      Ajuda
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-foreground"
                      onClick={onLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
