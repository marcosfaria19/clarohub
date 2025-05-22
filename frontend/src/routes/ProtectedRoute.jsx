// src/routes/ProtectedRoute.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../modules/shared/contexts/AuthContext";

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

const ProtectedRoute = ({ allowedRoles, children, isLoginPage = false }) => {
  const { token } = useContext(AuthContext);

  if (isLoginPage && token && !isTokenExpired(token)) {
    return <Navigate to="/home" replace />;
  }

  if (!isLoginPage) {
    if (!token || isTokenExpired(token)) {
      return <Navigate to="/login" replace />;
    }

    let decodedToken;
    try {
      decodedToken = jwtDecode(token);
    } catch (error) {
      console.error("Erro ao decodificar o token:", error);
      return <Navigate to="/login" replace />;
    }

    const userPermissions = decodedToken.PERMISSOES || [];
    const hasAccess = allowedRoles.some((role) =>
      userPermissions.includes(role),
    );

    if (!hasAccess) {
      return <Navigate to="/home" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
