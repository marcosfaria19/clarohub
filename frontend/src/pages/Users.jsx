import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Table, Button, Modal, Form } from "react-bootstrap";
import "./Users.css";

function Users() {
  const [dados, setDados] = useState([]);
  const [gestores, setGestores] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  useEffect(() => {
    fetchDados();
    fetchGestores();
  }, []);

  const fetchDados = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/users`
      );
      setDados(response.data);
    } catch (error) {
      console.error("Erro ao buscar dados do backend:", error);
      console.log(`URL: ${process.env.REACT_APP_BACKEND_URL}`);
    }
  };

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

  const handleEditClick = (item) => {
    setCurrentItem(item);
    setShowEditModal(true);
  };

  const handleDeleteClick = (item) => {
    setCurrentItem(item);
    setShowDeleteModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setCurrentItem((prevItem) => ({ ...prevItem, [name]: value }));
  };

  const handleEditSave = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/users/${currentItem._id}`,
        currentItem
      );
      setShowEditModal(false);
      fetchDados();
    } catch (error) {
      console.error("Erro ao atualizar dados:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/users/${currentItem._id}`
      );
      setShowDeleteModal(false);
      fetchDados();
    } catch (error) {
      console.error("Erro ao deletar dados:", error);
    }
  };

  return (
    <Container className="dados-container">
      <div className="mt-4">
        <h3>Usuários Cadastrados</h3>
        <Table bordered hover className="mt-4">
          <thead>
            <tr>
              <th>LOGIN</th>
              <th>NOME</th>
              <th>GESTOR</th>
              <th>PERMISSÕES</th>
              <th>AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {dados.map((item, index) => (
              <tr key={index}>
                <td>{item.LOGIN}</td>
                <td>{item.NOME}</td>
                <td>{item.GESTOR}</td>
                <td>{item.PERMISSOES}</td>
                <td className="acoes">
                  <Button
                    variant="outline-dark"
                    onClick={() => handleEditClick(item)}
                    className="botaoEditar"
                  >
                    <i className="bi bi-pencil-square"></i>
                  </Button>
                  <Button
                    variant="outline-danger"
                    onClick={() => handleDeleteClick(item)}
                    className="botaoDeletar"
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Modal de Edição */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Cadastro</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentItem && (
            <Form>
              <Form.Group controlId="formLogin">
                <Form.Label>LOGIN</Form.Label>
                <Form.Control
                  type="text"
                  name="LOGIN"
                  value={currentItem.LOGIN}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group controlId="formNome">
                <Form.Label>NOME</Form.Label>
                <Form.Control
                  type="text"
                  name="NOME"
                  value={currentItem.NOME}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group controlId="formGestor">
                <Form.Label>GESTOR</Form.Label>
                <Form.Control
                  as="select"
                  name="GESTOR"
                  value={currentItem.GESTOR}
                  onChange={handleEditChange}
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
                <Form.Label>PERMISSÕES</Form.Label>
                <Form.Control
                  type="text"
                  name="PERMISSOES"
                  value={currentItem.PERMISSOES}
                  onChange={handleEditChange}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleEditSave}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Confirmação de Exclusão */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>Tem certeza que deseja excluir este cadastro?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Excluir
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Users;
