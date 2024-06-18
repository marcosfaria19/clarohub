import React, { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Rotas from "./routes/Rotas";
import "./App.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      try {
        const decodedToken = jwtDecode(token);
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
      } catch (error) {
        console.error("Erro ao decodificar o token:", error);
      }
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      localStorage.removeItem("gestor");
    }
  }, [token]);

  const logout = () => {
    setToken(null);
    setUserName("");
  };

  return (
    <Router>
      {token && <Header userName={userName} onLogout={logout} />}
      <Rotas token={token} setToken={setToken} />
      {token && <Footer />}
    </Router>
  );
}

export default App;
