import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { Button } from "./ui/button";
import { MenuIcon } from "lucide-react";

export default function Header({ userName, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="m-0 select-none bg-menu p-3">
      <div className="container mx-auto flex items-center justify-between px-2">
        <Link to="/home" className="flex items-center">
          <img src={logo} alt="Logo" className="mr-2 h-8 w-8" />
          <span className="text-lg font-semibold text-foreground">
            Claro Hub
          </span>
        </Link>

        {/* Menu suspenso fechado */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
          >
            <MenuIcon />
          </Button>
        </div>

        {/* Menu normal */}
        <div className="hidden flex-col items-center space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 md:flex">
          <span className="text-center text-muted sm:text-left">
            Bem-vindo(a), <span className="font-semibold">{userName}</span>
          </span>
          <Button variant="outline" onClick={onLogout}>
            Logout
          </Button>
        </div>
      </div>

      {/* Menu suspenso aberto */}
      <nav
        className={`${
          isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden bg-menu transition-all duration-500 md:hidden`}
      >
        <span className="block py-2 text-center text-muted">
          Bem-vindo(a), <span className="font-semibold">{userName}</span>
        </span>
        <Button variant="outline" className="mt-2 w-full" onClick={onLogout}>
          Logout
        </Button>
      </nav>
    </header>
  );
}
