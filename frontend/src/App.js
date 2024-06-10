// App.js
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import Rotas from "./routes/Routes";
import Footer from "./components/Footer";
import Login from "./pages/Login";

import "./App.css";

function App() {
  return (
    <Router>
      <Main />
    </Router>
  );
}

function Main() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="App">
      {!isLoginPage && <Header />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Rotas />} />
      </Routes>
      {!isLoginPage && <Footer />}
    </div>
  );
}

export default App;
