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
  const [login, setLogin] = useState("");
  const [gestor, setGestor] = useState("");

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          // Token expirado, limpar localStorage
          localStorage.removeItem("token");
          setToken(null);
          setUserName("");
          setLogin("");
        } else {
          localStorage.setItem("token", token);
          if (decodedToken && decodedToken.NOME) {
            const nomeCompleto = decodedToken.NOME;
            const nomes = nomeCompleto.split(" ");
            const primeirosNomes = nomes.slice(0, 2).join(" ");
            const primeirosNomesFormatados = primeirosNomes
              .split(" ")
              .map(
                (nome) =>
                  nome.charAt(0).toUpperCase() + nome.slice(1).toLowerCase(),
              )
              .join(" ");

            setUserName(primeirosNomesFormatados);

            localStorage.setItem("userName", nomeCompleto);
            localStorage.setItem("gestor", decodedToken.GESTOR);
            setLogin(decodedToken.LOGIN);
          }
        }
      } catch (error) {
        console.error("Erro ao decodificar o token:", error);
        localStorage.removeItem("token");
        setToken(null);
        setUserName("");
        setLogin("");
      }
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      localStorage.removeItem("gestor");
    }
  }, [token]);

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("gestor");
    setLogin("");
    setUserName("");
  };

  return (
    <Router>
      {!token && <Navigate to="/login" />}
      {token && <Header userName={userName} onLogout={logout} login={login} />}
      <Rotas
        token={token}
        setToken={setToken}
        userName={userName}
        gestor={gestor}
      />
      {token && <Footer />}
      <Toaster position="bottom-right" richColors />
    </Router>
  );
}

export default App;
