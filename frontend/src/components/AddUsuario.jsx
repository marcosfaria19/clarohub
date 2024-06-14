import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

const AddUsuario = ({
  show,
  handleClose,
  handleSave,
  currentItem,
  handleChange,
  isEditMode,
}) => {
  const [gestores, setGestores] = useState([]);

  useEffect(() => {
    const fetchGestores = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/users/managers`
        );
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

  return (
    <Modal show={show} onHide={handleClose}>
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
              name="LOGIN"
              value={currentItem.LOGIN}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formNome">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              type="text"
              name="NOME"
              value={currentItem.NOME}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formGestor">
            <Form.Label>Gestor</Form.Label>
            <Form.Control
              as="select"
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
          <Form.Group controlId="formPermissoes">
            <Form.Label>Permissões</Form.Label>
            <Form.Control
              type="text"
              name="PERMISSOES"
              value={currentItem.PERMISSOES}
              onChange={handleChange}
            />
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
      </Modal.Footer>
    </Modal>
  );
};

export default AddUsuario;
