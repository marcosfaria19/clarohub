import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "modules/shared/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "modules/shared/components/ui/sheet";
import { MenuIcon, LogOut, Sun, Moon } from "lucide-react";
import logo from "modules/shared/assets/logo.png";
import logoLight from "modules/shared/assets/logo-light.png";
import AvatarDropdown from "modules/shared/components/AvatarDropdown";

export default function Header({ userName, onLogout, login }) {
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

  return (
    <header className="fixed top-0 z-50 w-full bg-menu opacity-90">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/home" className="flex items-center space-x-2">
          <img
            src={theme === "dark" ? logo : logoLight}
            alt="Claro Hub"
            className="h-8 w-8"
          />

          <span className="text-lg font-semibold text-foreground">
            Claro Hub
          </span>
        </Link>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            className="text-muted-foreground"
            size="icon"
            onClick={toggleTheme}
            aria-label={`Alternar para modo ${theme === "dark" ? "claro" : "escuro"}`}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          <span className="hidden text-muted-foreground lg:inline-block">
            Bem-vindo(a), <span className="font-semibold">{userName}</span>
          </span>

          <div className="hidden md:block">
            <AvatarDropdown
              onLogout={onLogout}
              login={login}
              userName={userName}
            />
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground md:hidden"
              >
                <MenuIcon className="h-6 w-6" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="mt-4 flex flex-col space-y-4">
                <span className="text-muted-foreground">
                  Bem-vindo(a),{" "}
                  <span className="font-semibold">{userName}</span>
                </span>
                <Button variant="outline" onClick={onLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
