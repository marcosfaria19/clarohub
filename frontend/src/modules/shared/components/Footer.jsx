import React, { useState } from "react";
import Espeto from "./Espeto";

const Footer = () => {
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  return (
    <footer className="bg-menu select-none p-5 text-muted">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        <p>&copy; Projetos Americana {new Date().getFullYear()}</p>
        <p>
          Desenvolvido p
          <span onClick={handleShow} className="cursor-default">
            o
          </span>
          r: Marcos Faria / Fares Nunes
        </p>
      </div>
      <Espeto show={showModal} handleClose={handleClose} />
    </footer>
  );
};

export default Footer;
