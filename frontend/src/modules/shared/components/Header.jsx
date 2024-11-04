import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
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
import logo from "modules/shared/assets/logo.png";
import logoLight from "modules/shared/assets/logo-light.png";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "modules/shared/components/ui/avatar";
import AvatarDropdown from "modules/shared/components/AvatarDropdown";
import NotificationsPopover from "modules/shared/components/NotificationsPopover";
import formatUserName from "modules/shared/utils/formatUsername";
import { AuthContext } from "contexts/AuthContext";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    document.documentElement.classList.toggle(
      "light-theme",
      savedTheme === "light",
    );
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle(
      "light-theme",
      newTheme === "light",
    );
  };

  const onLogout = () => {
    logout(); //
  };

  return (
    <header className="text-menu-foreground fixed z-40 mr-0 w-screen select-none bg-menu opacity-90">
      <div className="container flex items-center justify-between px-4 py-2 sm:max-w-[1800px]">
        <Link to="/home" className="flex items-center space-x-2">
          <img
            /* src={theme === "dark" ? logo : logoLight} */
            src={logo}
            alt="Claro Hub"
            className="mr-1 h-7 w-7"
          />
          <span className="text-2xl font-semibold">Claro Hub</span>
        </Link>

        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
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
              <span className="text-menu-foreground hidden opacity-90 lg:inline-block">
                Bem-vindo(a),{" "}
                <span className="font-semibold">
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
                <SheetContent side="right" className="bg-menu">
                  <div className="mt-4 flex flex-col space-y-4">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} alt="@usuario" />
                        <AvatarFallback className="bg-secondary text-accent">
                          {user.userName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-menu-foreground text-sm font-medium">
                          {formatUserName(user.userName)}
                        </span>
                        <span className="text-menu-foreground text-xs">
                          {user.login}
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full justify-start">
                      <UserIcon className="mr-2 h-4 w-4" />
                      Perfil
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <SettingsIcon className="mr-2 h-4 w-4" />
                      Configurações
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <HelpCircleIcon className="mr-2 h-4 w-4" />
                      Ajuda
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
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
