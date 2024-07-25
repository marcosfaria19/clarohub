import React, { useState } from "react";
import { Container, Navbar } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Footer.css";
import Espeto from "./Espeto"; // Importando o modal

const Footer = () => {
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  return (
    <Navbar variant="dark" className="footer">
      <Container className="justify-content-between">
        <Navbar.Text>
          &copy; Projetos Americana {new Date().getFullYear()}
        </Navbar.Text>
        <Navbar.Text>
          Desenvolvido p
          <span onClick={handleShow} className="hidden-easter-egg">
            o
          </span>
          r: Marcos Faria / Fares Nunes
        </Navbar.Text>
      </Container>
      <Espeto show={showModal} handleClose={handleClose} />
    </Navbar>
  );
};

export default Footer;
