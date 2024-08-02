import React, { useState } from "react";
import Espeto from "./Espeto";

const Footer = () => {
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  return (
    <footer className="bg-nav text-textContent py-4 select-none">
      <div className="container mx-auto flex justify-between items-center">
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
