import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import OCQualinet from "../pages/OCQualinet";
import Cadastros from "../pages/Cadastros";
import NetSMSFacil from "../pages/NetSMSFacil";
import Login from "../pages/Login";
import Users from "../pages/Users";
import Home from "../pages/Home";
import NetSMSFacilAdmin from "../pages/NetSMSFacilAdmin";
import { useAuth } from "../services/AuthContext";

const Rotas = () => {
  const { token } = useAuth();
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
        element={
          token && checkPermissions(token, ["admin"]) ? (
            <Cadastros />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/ocfacil"
        element={
          token && checkPermissions(token, ["basic", "manager", "admin"]) ? (
            <OCQualinet />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/netfacil"
        element={
          token && checkPermissions(token, ["basic", "manager", "admin"]) ? (
            <NetSMSFacil />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/netadmin"
        element={
          token && checkPermissions(token, ["admin"]) ? (
            <NetSMSFacilAdmin />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/users"
        element={
          token && checkPermissions(token, ["admin"]) ? (
            <Users />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
};

export default Rotas;
