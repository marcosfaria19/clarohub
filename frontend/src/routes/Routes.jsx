import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import OCQualinet from "../pages/OCQualinet";
import Cadastros from "../pages/Cadastros";
import NetSMSFacil from "../pages/NetSMSFacil";
import Login from "../pages/Login";
import Users from "../pages/Users";
import Home from "../pages/Home";

const Rotas = ({ token, setToken }) => {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          token ? <Navigate to="/home" /> : <Login setToken={setToken} />
        }
      />
      <Route path="/" element={token ? <Home /> : <Navigate to="/login" />} />
      <Route
        path="/home"
        element={token ? <Home /> : <Navigate to="/login" />}
      />
      <Route
        path="/dados"
        element={token ? <Cadastros /> : <Navigate to="/login" />}
      />
      <Route
        path="/ocqualinet"
        element={token ? <OCQualinet /> : <Navigate to="/login" />}
      />
      <Route
        path="/netsms"
        element={token ? <NetSMSFacil /> : <Navigate to="/login" />}
      />
      <Route
        path="/users"
        element={token ? <Users /> : <Navigate to="/login" />}
      />
    </Routes>
  );
};

export default Rotas;
