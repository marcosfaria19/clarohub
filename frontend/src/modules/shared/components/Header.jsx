import React from "react";
import { Link } from "react-router-dom";
import { Button } from "modules/shared/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "modules/shared/components/ui/sheet";
import { MenuIcon, LogOut } from "lucide-react";
import logo from "modules/shared/assets/logo.png";
import AvatarDropdown from "modules/shared/components/AvatarDropdown";

export default function Header({ userName, onLogout, login }) {
  return (
    <header className="fixed top-0 z-50 w-screen bg-menu opacity-90">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/home" className="flex items-center space-x-2">
          <img src={logo} alt="Claro Hub" className="h-8 w-8" />
          <span className="text-lg font-semibold text-foreground">
            Claro Hub
          </span>
        </Link>

        <nav className="hidden items-center space-x-4 md:flex">
          <span className="text-foreground/70">
            Bem-vindo(a), <span className="font-semibold">{userName}</span>
          </span>
          <AvatarDropdown
            onLogout={onLogout}
            login={login}
            userName={userName}
          />
        </nav>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Abrir menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="mt-4 flex flex-col space-y-4">
              <span className="text-muted-foreground">
                Bem-vindo(a), <span className="font-semibold">{userName}</span>
              </span>
              <Button variant="outline" onClick={onLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
