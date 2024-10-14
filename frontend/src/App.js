import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Header from "./modules/shared/components/Header";
import Footer from "./modules/shared/components/Footer";
import Rotas from "./routes/Rotas";
import "./App.css";
import { Toaster } from "modules/shared/components/ui/sonner";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [login, setLogin] = useState("");
  const [gestor, setGestor] = useState("");
  const [avatar, setAvatar] = useState("");

  const handleReset = () => {
    setUserName("");
    setUserId("");
    setLogin("");
    setGestor("");
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
        } else {
          localStorage.setItem("token", token);
          if (decodedToken && decodedToken.NOME) {
            setUserName(decodedToken.NOME);
            setLogin(decodedToken.LOGIN);
            setUserId(decodedToken.id);
            setGestor(decodedToken.GESTOR);
            setAvatar(decodedToken.avatar);
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
    <Router username={userName} gestor={gestor}>
      {!token && <Navigate to="/login" />}
      {token && (
        <Header
          userName={userName}
          gestor={gestor}
          onLogout={logout}
          login={login}
          userId={userId}
          avatar={avatar}
        />
      )}
      <Rotas
        token={token}
        setToken={setToken}
        userName={userName}
        gestor={gestor}
        userId={userId}
      />
      {token && <Footer />}

      <Toaster position="bottom-right" richColors />
    </Router>
  );
}

export default App;
