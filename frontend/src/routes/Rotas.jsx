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
import Clarospark from "modules/clarospark/pages/Home";
import { AuthContext } from "modules/shared/contexts/AuthContext";
import PageTitle from "modules/shared/components/PageTitle";

const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
  } catch (error) {
    console.error("Erro ao decodificar o token:", error);
    return true;
  }
};

const ProtectedRoute = ({ allowedRoles, element }) => {
  const { token, user } = useContext(AuthContext);

  if (!token || isTokenExpired(token)) {
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
          <>
            <PageTitle title="Claro Hub" />
            <ProtectedRoute
              allowedRoles={["guest", "basic", "manager", "admin"]}
              element={<Home />}
            />
          </>
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
          <>
            <PageTitle title="OC Fácil" />
            <ProtectedRoute
              allowedRoles={["basic", "manager", "admin"]}
              element={<OCQualinet />}
            />
          </>
        }
      />
      <Route
        path="/netfacil"
        element={
          <>
            <PageTitle title="Net Fácil" />
            <ProtectedRoute
              allowedRoles={["guest", "basic", "manager", "admin"]}
              element={<NetSMSFacil />}
            />
          </>
        }
      />

      <Route
        path="/spark"
        element={
          <>
            <PageTitle title="Claro Spark" />
            <ProtectedRoute
              allowedRoles={["guest", "basic", "manager", "admin"]}
              element={<Clarospark />}
            />
          </>
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
      <Route path="*" element={<Navigate to="/home" />} />
    </Routes>
  );
};

export default Rotas;
