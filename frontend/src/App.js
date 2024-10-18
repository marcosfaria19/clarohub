import React, { useContext } from "react";
import { BrowserRouter as Router, Navigate } from "react-router-dom";

import Header from "./modules/shared/components/Header";
import Footer from "./modules/shared/components/Footer";
import Rotas from "./routes/Rotas";
import "./App.css";
import { Toaster } from "modules/shared/components/ui/sonner";
import { AuthContext } from "contexts/AuthContext";

function App() {
  // Acessa o contexto de autenticação
  const { token } = useContext(AuthContext);

  return (
    <Router>
      {!token && <Navigate to="/login" />}
      {token && <Header />}
      <Rotas />
      {token && <Footer />}

      <Toaster position="bottom-right" richColors />
    </Router>
  );
}

export default App;
