// Header.jsx
import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Image, Button } from "react-bootstrap";
import logo from "../assets/logo.png";
import "./Header.css";

function Header({ userName, onLogout }) {
  return (
    <Navbar expand="lg" variant="dark" bg="dark" className="custom-navbar">
      <Container>
        <Navbar.Brand href="/home">
          <Image
            src={logo}
            alt="Logo"
            width="30"
            height="30"
            className="d-inline-block align-top me-2"
          />
          Claro Hub
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/ocqualinet">Upload Ocorrências</Nav.Link>
            <Nav.Link href="/netsms">NetSMS</Nav.Link>
            <Nav.Link href="/dados">Dados cadastrados</Nav.Link>
            <Nav.Link href="/users">Usuários cadastrados</Nav.Link>
            <Nav.Link href="/netsmsadmin">NetSMSFacil códigos</Nav.Link>
          </Nav>
          <Nav>
            <Navbar.Text className="me-2">Bem-vindo(a), {userName}</Navbar.Text>
            <Button variant="outline-light" onClick={onLogout}>
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
