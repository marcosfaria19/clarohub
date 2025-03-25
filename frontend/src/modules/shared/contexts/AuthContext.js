import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { Navigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState({
    userName: "",
    userId: "",
    login: "",
    gestor: "",
    avatar: "",
    permissoes: "",
    project: {},
  });

  const handleReset = () => {
    setUser({
      userName: "",
      userId: "",
      login: "",
      gestor: "",
      avatar: "",
      permissoes: "",
      project: {},
    });
    setToken(null);
  };

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          localStorage.removeItem("token");
          handleReset();
          <Navigate to="/login" />;
        } else {
          localStorage.setItem("token", token);
          if (decodedToken) {
            setUser({
              userName: decodedToken.NOME,
              userId: decodedToken.id,
              login: decodedToken.LOGIN,
              gestor: decodedToken.GESTOR,
              permissoes: decodedToken.PERMISSOES,
              avatar: decodedToken.avatar,
              dailyLikesUsed: decodedToken.dailyLikesUsed,
              dailyIdeasCreated: decodedToken.dailyIdeasCreated,
              project: decodedToken.project,
            });
          }
        }
      } catch (error) {
        console.error("Erro ao decodificar o token:", error);
        localStorage.removeItem("token");
        handleReset();
      }
    } else {
      handleReset();
      localStorage.removeItem("token");
    }
  }, [token]);

  const logout = () => {
    handleReset();
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ token, user, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
