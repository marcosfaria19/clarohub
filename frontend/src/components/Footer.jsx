// Footer.jsx

import React from "react";
import { Container, Navbar } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Footer.css";

const Footer = () => {
  return (
    <Navbar variant="dark" bg="dark" className="footer">
      <Container className="justify-content-center">
        <Navbar.Text>
          &copy; {new Date().getFullYear()} Equipe Espeto.
        </Navbar.Text>
      </Container>
    </Navbar>
  );
};

export default Footer;
