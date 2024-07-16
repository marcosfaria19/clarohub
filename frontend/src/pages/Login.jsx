import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/axios";

function Login({ setToken }) {
  const [credencial, setCredencial] = useState("");
  const [senha, setSenha] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  const handleCredencialChange = (e) => {
    const uppercasedValue = e.target.value.toUpperCase();
    setCredencial(uppercasedValue);
  };

  const handleSenhaChange = (e) => {
    setSenha(e.target.value);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post(`/login`, {
        LOGIN: credencial,
        senha: senha,
      });

      const token = response.data.token;
      if (typeof token === "string" && token.trim() !== "") {
        setToken(token);
        navigate("/home");
      } else {
        setLoginError("Erro ao obter o token de autenticação.");
      }
    } catch (err) {
      console.error("Login falhou", err);
      if (err.response && err.response.status === 401) {
        const message = err.response.data.message;
        if (message === "Nome de usuário ou senha inválidos") {
          setLoginError("Senha incorreta");
        } else if (
          message ===
          "Você ainda não cadastrou uma senha, registre uma senha para entrar"
        ) {
          setShowPasswordModal(true);
        }
      } else if (err.response && err.response.status === 404) {
        setLoginError(
          "Credencial não autorizada, solicitar acesso aos administradores"
        );
      } else {
        setLoginError("Erro ao realizar o login");
      }
    }
  };

  const handleRegisterSubmit = async () => {
    try {
      const response = await axiosInstance.put(`/register`, {
        LOGIN: credencial,
        senha: senha,
      });

      setShowPasswordModal(false);

      // Após registrar a senha, pode tentar fazer login novamente
      handleLoginSubmit({ preventDefault: () => {} });
    } catch (err) {
      console.error("Erro ao registrar senha", err);
      if (err.response && err.response.status === 401) {
        setLoginError(
          "Usuário sem permissão de acesso, solicitar ao administrador"
        );
      } else if (err.response && err.response.status === 400) {
        setLoginError("Este usuário já possui uma senha cadastrada");
      } else {
        setLoginError("Erro ao registrar a senha");
      }
    }
  };

  const handleModalClose = () => {
    setShowPasswordModal(false);
    setLoginError("");
  };

  return (
    <Container fluid className="login-page-container">
      <Row className="vh-100">
        <Col md={6} className="login-left">
          <img src="claro.png" alt="Logo" />
          <h1>Bem vindo(a)!</h1>
          <p>Por favor, insira suas credenciais para acessar.</p>
        </Col>
        <Col md={6} className="login-right">
          <h1 className="mb-5">Claro Hub</h1>
          <Form className="login-form" onSubmit={handleLoginSubmit}>
            <h2 className="mb-4">Login</h2>
            <Form.Group
              controlId="form-credencial"
              className="mb-3 form-floating"
            >
              <Form.Control
                className="credencial"
                placeholder=" "
                value={credencial}
                onChange={handleCredencialChange}
                required
              />
              <Form.Label>Credencial</Form.Label>
            </Form.Group>
            <Form.Group controlId="form-senha" className="mb-3 form-floating">
              <Form.Control
                type="password"
                className="senha"
                placeholder=" "
                value={senha}
                onChange={handleSenhaChange}
                required
              />
              <Form.Label>Senha</Form.Label>
            </Form.Group>
            <div className="loginError">
              {loginError && <p className="text-danger">{loginError}</p>}
            </div>

            <Button variant="dark" type="submit" className="w-100">
              Entrar
            </Button>
          </Form>
        </Col>
      </Row>
      {/* Modal para registrar senha */}
      <Modal centered show={showPasswordModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Cadastrar senha</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Parece ser seu primeiro acesso. Gostaria de registrar essa senha?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Voltar
          </Button>
          <Button variant="primary" onClick={handleRegisterSubmit}>
            Registrar senha
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Login;
