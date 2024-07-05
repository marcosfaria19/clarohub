import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import OCQualinet from "../pages/OCQualinet";
import NetSMSFacil from "../pages/NetSMSFacil";
import Login from "../pages/Login";
import Users from "../pages/Users";
import Home from "../pages/Home";
import NetSMSFacilAdmin from "../pages/NetSMSFacilAdmin";
import OCFacilAdmin from "../pages/OCFacilAdmin";
import AppAdmin from "../pages/AppAdmin";

const ProtectedRoute = ({ token, allowedRoles, element }) => {
  if (!token) {
    return <Navigate to="/login" />;
  }

  const decodedToken = jwtDecode(token);
  const userPermissions = decodedToken.PERMISSOES || [];

  const hasAccess = allowedRoles.some((role) => userPermissions.includes(role));
  if (!hasAccess) {
    return <Navigate to="/home" />;
  }

  return element;
};

const Rotas = ({ token, setToken }) => {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          token ? <Navigate to="/home" /> : <Login setToken={setToken} />
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute
            token={token}
            allowedRoles={["guest", "basic", "manager", "admin"]}
            element={<Home />}
          />
        }
      />
      <Route
        path="/home"
        element={
          <ProtectedRoute
            token={token}
            allowedRoles={["guest", "basic", "manager", "admin"]}
            element={<Home />}
          />
        }
      />
      <Route
        path="/ocadmin"
        element={
          <ProtectedRoute
            token={token}
            allowedRoles={["manager", "admin"]}
            element={<OCFacilAdmin />}
          />
        }
      />
      <Route
        path="/ocfacil"
        element={
          <ProtectedRoute
            token={token}
            allowedRoles={["basic", "manager", "admin"]}
            element={<OCQualinet />}
          />
        }
      />
      <Route
        path="/netfacil"
        element={
          <ProtectedRoute
            token={token}
            allowedRoles={["guest", "basic", "manager", "admin"]}
            element={<NetSMSFacil />}
          />
        }
      />
      <Route
        path="/netadmin"
        element={
          <ProtectedRoute
            token={token}
            allowedRoles={["admin"]}
            element={<NetSMSFacilAdmin />}
          />
        }
      />
      <Route
        path="/appadmin"
        element={
          <ProtectedRoute
            token={token}
            allowedRoles={["admin"]}
            element={<AppAdmin />}
          />
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute
            token={token}
            allowedRoles={["admin"]}
            element={<Users />}
          />
        }
      />
    </Routes>
  );
};

export default Rotas;
