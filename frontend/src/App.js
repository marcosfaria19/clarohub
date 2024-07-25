import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Header from "./modules/shared/components/Header";
import Footer from "./modules/shared/components/Footer";
import Rotas from "./routes/Rotas";
import "./App.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userName, setUserName] = useState("");

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
        } else {
          localStorage.setItem("token", token);
          if (decodedToken && decodedToken.NOME) {
            const nomeCompleto = decodedToken.NOME;
            const primeiroNome = nomeCompleto.split(" ")[0];
            const primeiroNomeFormatado =
              primeiroNome.charAt(0).toUpperCase() +
              primeiroNome.slice(1).toLowerCase();
            setUserName(primeiroNomeFormatado);

            localStorage.setItem("userName", nomeCompleto);
            localStorage.setItem("gestor", decodedToken.GESTOR);
          }
        }
      } catch (error) {
        console.error("Erro ao decodificar o token:", error);
        localStorage.removeItem("token");
        setToken(null);
        setUserName("");
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
    setUserName("");
  };

  return (
    <Router>
      {!token && <Navigate to="/login" />}
      {token && <Header userName={userName} onLogout={logout} />}
      <Rotas token={token} setToken={setToken} />
      {token && <Footer />}
    </Router>
  );
}

export default App;
