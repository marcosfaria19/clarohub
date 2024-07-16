import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "./AddUsuario.css";
import axiosInstance from "../services/axios";

const AddUsuario = ({
  show,
  handleClose,
  handleSave,
  currentItem,
  handleChange,
  isEditMode,
}) => {
  const [gestores, setGestores] = useState([]);
  const permissions = ["guest", "basic", "manager", "admin"];

  useEffect(() => {
    const fetchGestores = async () => {
      try {
        const response = await axiosInstance.get(`/users/managers`);
        setGestores(response.data);
      } catch (error) {
        console.error("Erro ao buscar gestores do backend:", error);
      }
    };

    fetchGestores();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSave();
  };

  const handleResetPassword = async () => {
    try {
      await axiosInstance.patch(`/users/${currentItem._id}/reset-password`);
      alert("Senha resetada com sucesso!");
    } catch (error) {
      console.error("Erro ao resetar a senha:", error);
      alert("Erro ao resetar a senha.");
    }
  };

  return (
    <Modal centered show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {isEditMode ? "Editar Usuário" : "Adicionar Usuário"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formCredencial">
            <Form.Label>Credencial</Form.Label>
            <Form.Control
              type="text"
              placeholder="Digite o login"
              name="LOGIN"
              value={currentItem.LOGIN}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formNome">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              type="text"
              placeholder="Digite o nome"
              name="NOME"
              value={currentItem.NOME}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formGestor">
            <Form.Label>Gestor</Form.Label>
            <Form.Control
              as="select"
              placeholder="Selecione o gestor"
              name="GESTOR"
              value={currentItem.GESTOR}
              onChange={handleChange}
            >
              <option value="">Selecione um gestor</option>
              {gestores.map((gestor, index) => (
                <option key={index} value={gestor}>
                  {gestor}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formPermissao">
            <Form.Label>Permissão</Form.Label>
            <div className="d-flex gap-2">
              {permissions.map((permission) => {
                let icon;
                switch (permission) {
                  case "guest":
                    icon = <i className="bi bi-person-fill"></i>;
                    break;
                  case "basic":
                    icon = <i className="bi bi-person-fill"></i>;
                    break;
                  case "manager":
                    icon = <i className="bi bi-bar-chart-fill"></i>;
                    break;
                  case "admin":
                    icon = <i className="bi bi-shield-shaded"></i>;
                    break;
                  default:
                    icon = <i></i>;
                }

                return (
                  <Button
                    key={permission}
                    variant="outline-secondary"
                    className={`permission-button ${permission} ${
                      currentItem.PERMISSOES === permission ? "active" : ""
                    }`}
                    onClick={() =>
                      handleChange({
                        target: { name: "PERMISSOES", value: permission },
                      })
                    }
                  >
                    {icon}{" "}
                    {permission.charAt(0).toUpperCase() + permission.slice(1)}
                  </Button>
                );
              })}
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSave}>
          {isEditMode ? "Salvar" : "Adicionar"}
        </Button>
        {isEditMode && (
          <Button variant="danger" onClick={handleResetPassword}>
            Resetar Senha
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default AddUsuario;
