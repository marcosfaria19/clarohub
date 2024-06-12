// Login.jsx
import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "./Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login({ setToken }) {
  const [credencial, setCredencial] = useState("");
  const navigate = useNavigate();

  const handleCredencialChange = (e) => {
    const uppercasedValue = e.target.value.toUpperCase();
    setCredencial(uppercasedValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/login`,
        { LOGIN: credencial }
      );

      setToken(response.data.token);
      navigate("/home");
    } catch (err) {
      console.error("Login falhou", err);
    }
  };

  return (
    <Container fluid className="login-page-container">
      <Row className="vh-100">
        <Col md={6} className="login-left">
          <img src="claro.png" alt="Logo" />
          <h1>Bem vindo(a)!</h1>
          <p>Insira suas credenciais.</p>
        </Col>
        <Col md={6} className="login-right">
          <h1 className="mb-5">Claro Hub</h1>
          <Form className="login-form" onSubmit={handleSubmit}>
            <h2 className="mb-4">Login</h2>
            <Form.Group
              controlId="form-credencial"
              className="mb-3 form-floating">
              <Form.Control
                className="credencial"
                placeholder=" "
                value={credencial}
                onChange={handleCredencialChange}
              />
              <Form.Label>Credencial</Form.Label>
            </Form.Group>

            <Button variant="dark" type="submit" className="w-100">
              Entrar
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
