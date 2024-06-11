// App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Rotas from "./routes/Routes";
import Footer from "./components/Footer";
import Login from "./pages/Login";

import "./App.css";

function App() {
  const [userName, setUserName] = useState(localStorage.getItem("userName"));

  const handleLogout = () => {
    // Limpar o localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    // Atualizar o estado do nome do usuário
    setUserName(null);
    // Redirecionar para a página de login, se necessário
    window.location.href = "/login";
  };

  return (
    <Router>
      <Main
        userName={userName}
        setUserName={setUserName}
        onLogout={handleLogout}
      />
    </Router>
  );
}

function Main({ userName, setUserName, onLogout }) {
  return (
    <div className="App">
      <Routes>
        <Route
          path="/login"
          element={<Login onLogin={(name) => setUserName(name)} />}
        />
        <Route
          path="*"
          element={<ProtectedRoutes userName={userName} onLogout={onLogout} />}
        />
      </Routes>
    </div>
  );
}

function ProtectedRoutes({ userName, onLogout }) {
  return (
    <>
      <Header userName={userName} onLogout={onLogout} />
      <Rotas />
      <Footer />
    </>
  );
}

export default App;
