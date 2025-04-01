import React, { useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import OCQualinet from "modules/clarohub/pages/OCQualinet";
import NetFacil from "modules/clarohub/pages/NetFacil";
import Login from "modules/clarohub/pages/Login";
import Home from "modules/clarohub/pages/Home";
import NetFacilAdmin from "modules/clarohub/pages/NetFacilAdmin";
import OCFacilAdmin from "modules/clarohub/pages/OCFacilAdmin";
import AppAdmin from "modules/clarohub/pages/AppAdmin";
import Clarospark from "modules/clarospark/pages/Home";
import { AuthContext } from "modules/shared/contexts/AuthContext";
import PageTitle from "modules/shared/components/PageTitle";
import Claroflow from "modules/claroflow/pages/Flow";
import AssignmentBoard from "modules/claroflow/pages/AssignmentBoard";
import UsersAdmin from "modules/clarohub/pages/Users";
import ProjectsFlowDashboard from "modules/claroflow/components/project-flow/ProjectFlowDashboard";

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
              element={<NetFacil />}
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
        path="/flow"
        element={
          <>
            <PageTitle title="Claro Flow" />
            <ProtectedRoute
              allowedRoles={["guest", "basic", "manager", "admin"]}
              element={<Claroflow />}
            />
          </>
        }
      />

      <Route
        path="/netadmin"
        element={
          <ProtectedRoute
            allowedRoles={["admin"]}
            element={<NetFacilAdmin />}
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
        path="/usersadmin"
        element={
          <ProtectedRoute
            token={token}
            allowedRoles={["admin"]}
            element={<UsersAdmin />}
          />
        }
      />

      {/* Rotas do Claro Flow */}

      <Route
        path="/projects/admin"
        element={
          <ProtectedRoute
            token={token}
            allowedRoles={["admin"]}
            element={<ProjectsFlowDashboard />}
          />
        }
      />
      <Route
        path="/projects/board"
        element={
          <ProtectedRoute
            token={token}
            allowedRoles={["admin"]}
            element={<AssignmentBoard />}
          />
        }
      />

      <Route path="*" element={<Navigate to="/home" />} />
    </Routes>
  );
};

export default Rotas;
