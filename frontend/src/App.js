import React, { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Rotas from "./routes/Routes";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      const decodedToken = jwtDecode(token);
      const nomeCompleto = decodedToken.NOME;
      const primeiroNome = nomeCompleto.split(" ")[0];
      const primeiroNomeFormatado =
        primeiroNome.charAt(0).toUpperCase() +
        primeiroNome.slice(1).toLowerCase();
      setUserName(primeiroNomeFormatado);
    } else {
      localStorage.removeItem("token");
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
