// Routes.jsx

import React from "react";
import { Route, Routes } from "react-router-dom";
import OCQualinet from "../pages/OCQualinet";
import Cadastros from "../pages/Cadastros";
import NetSMSFacil from "../pages/NetSMSFacil";
import Login from "../pages/Login";
import RotasPrivadas from "./RotasPrivadas";
import Users from "../pages/Users";

const Rotas = () => {
  return (
    <Routes>
      <Route path="/ocqualinet" element={<OCQualinet />} />
      {/*       <Route
        path="/dados"
        element={
          <RotasPrivadas>
            <Cadastros />
          </RotasPrivadas>
        }
      /> */}
      <Route path="/dados" element={<Cadastros />} />
      <Route path="/netsms" element={<NetSMSFacil />} />
      <Route path="/login" element={<Login />} />
      <Route path="/users" element={<Users />} />
    </Routes>
  );
};

export default Rotas;
