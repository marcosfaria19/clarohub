import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import Button from "./Buttons";

function Header({ userName, onLogout }) {
  return (
    <nav className="bg-nav text-textContent p-2 select-none ">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/home" className="flex items-center">
          <img src={logo} alt="Logo" className="w-8 h-8 mr-2 " />
          <span className="text-white text-lg font-semibold">Claro Hub</span>
        </Link>
        <div className="flex items-center space-x-4 text-md">
          <span className="text-textContent ">
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
