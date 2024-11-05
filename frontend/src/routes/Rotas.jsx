import React, { useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import OCQualinet from "modules/clarohub/pages/OCQualinet";
import NetSMSFacil from "modules/clarohub/pages/NetSMSFacil";
import Login from "modules/clarohub/pages/Login";
import Users from "modules/clarohub/pages/Users";
import Home from "modules/clarohub/pages/Home";
import NetSMSFacilAdmin from "modules/clarohub/pages/NetSMSFacilAdmin";
import OCFacilAdmin from "modules/clarohub/pages/OCFacilAdmin";
import AppAdmin from "modules/clarohub/pages/AppAdmin";
import ClaroStorm from "modules/clarostorm/pages/Home";
import { AuthContext } from "modules/shared/contexts/AuthContext";

const ProtectedRoute = ({ allowedRoles, element }) => {
  const { token, user } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/login" />;
  }

  let decodedToken;
  try {
    decodedToken = jwtDecode(token);
  } catch (error) {
    console.error("Erro ao decodificar o token:", error);
    return <Navigate to="/login" />;
  }

  const userPermissions = decodedToken.PERMISSOES || [];

  const hasAccess = allowedRoles.some((role) => userPermissions.includes(role));

  if (!hasAccess) {
    return <Navigate to="/home" />;
  }

  return React.cloneElement(element, { token, ...user });
};

const Rotas = () => {
  const { token } = useContext(AuthContext);

  return (
    <Routes>
      <Route
        path="/login"
        element={token ? <Navigate to="/home" /> : <Login />}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute
            allowedRoles={["guest", "basic", "manager", "admin"]}
            element={<Home />}
          />
        }
      />
      <Route
        path="/home"
        element={
          <ProtectedRoute
            allowedRoles={["guest", "basic", "manager", "admin"]}
            element={<Home />}
          />
        }
      />
      <Route
        path="/ocadmin"
        element={
          <ProtectedRoute
            allowedRoles={["manager", "admin"]}
            element={<OCFacilAdmin />}
          />
        }
      />
      <Route
        path="/ocfacil"
        element={
          <ProtectedRoute
            allowedRoles={["basic", "manager", "admin"]}
            element={<OCQualinet />}
          />
        }
      />
      <Route
        path="/netfacil"
        element={
          <ProtectedRoute
            allowedRoles={["guest", "basic", "manager", "admin"]}
            element={<NetSMSFacil />}
          />
        }
      />
      <Route
        path="/storm"
        element={
          <ProtectedRoute
            allowedRoles={["guest", "basic", "manager", "admin"]}
            element={<ClaroStorm />}
          />
        }
      />
      <Route
        path="/netadmin"
        element={
          <ProtectedRoute
            allowedRoles={["admin"]}
            element={<NetSMSFacilAdmin />}
          />
        }
      />
      <Route
        path="/appadmin"
        element={
          <ProtectedRoute allowedRoles={["admin"]} element={<AppAdmin />} />
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
