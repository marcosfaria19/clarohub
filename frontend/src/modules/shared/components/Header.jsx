import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { Button } from "./ui/button";

function Header({ userName, onLogout }) {
  return (
    <nav className="bg-nav text-textContent select-none p-2">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/home" className="flex items-center">
          <img src={logo} alt="Logo" className="mr-2 h-8 w-8" />
          <span className="text-lg font-semibold text-white">Claro Hub</span>
        </Link>
        <div className="text-md flex items-center space-x-4">
          <span className="text-textContent">
            Bem-vindo(a), <span className="font-semibold">{userName}</span>
          </span>
          <Button variant="outline-primary" onClick={onLogout}>
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}

export default Header;
