import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Table, Button, Modal, Form } from "react-bootstrap";
import "./Cadastros.css";

// Função para formatar a data
const formatarData = (dataNumerica) => {
  // Converter a data numérica para objeto de data
  const data = new Date((dataNumerica - 25569) * 86400 * 1000);

  // Extrair dia, mês e ano
  const dia = data.getDate().toString().padStart(2, "0");
  const mes = (data.getMonth() + 1).toString().padStart(2, "0");
  const ano = data.getFullYear();

  // Retornar a data formatada
  return `${dia}/${mes}/${ano}`;
};

function Cadastros() {
  const [dados, setDados] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  useEffect(() => {
    fetchDados();
  }, []);

  const fetchDados = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/data`
      );
      setDados(response.data);
    } catch (error) {
      console.error("Erro ao buscar dados do backend:", error);
      console.log(`URL: ${process.env.REACT_APP_BACKEND_URL}`);
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
        `${process.env.REACT_APP_BACKEND_URL}/data/${currentItem._id}`,
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
        `${process.env.REACT_APP_BACKEND_URL}/data/${currentItem._id}`
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
        <h3>Cadastros</h3>
        <Table bordered hover className="mt-4">
          <thead>
            <tr>
              <th>CI_NOME</th>
              <th>UF</th>
              <th>NUM_CONTRATO</th>
              <th>DT_CADASTRO</th>
              <th>END_COMPLETO</th>
              <th>COD_NODE</th>
              <th>AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {dados.map((item, index) => (
              <tr key={index}>
                <td>{item.CI_NOME}</td>
                <td>{item.UF}</td>
                <td>{item.NUM_CONTRATO}</td>
                <td>{formatarData(item.DT_CADASTRO)}</td>
                <td>{item.END_COMPLETO}</td>
                <td>{item.COD_NODE}</td>
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
              <Form.Group controlId="formCINome">
                <Form.Label>CI_NOME</Form.Label>
                <Form.Control
                  type="text"
                  name="CI_NOME"
                  value={currentItem.CI_NOME}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group controlId="formNumContrato">
                <Form.Label>NUM_CONTRATO</Form.Label>
                <Form.Control
                  type="text"
                  name="NUM_CONTRATO"
                  value={currentItem.NUM_CONTRATO}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group controlId="formDtCadastro">
                <Form.Label>DT_CADASTRO</Form.Label>
                <Form.Control
                  type="text"
                  name="DT_CADASTRO"
                  value={currentItem.DT_CADASTRO}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group controlId="formEndCompleto">
                <Form.Label>END_COMPLETO</Form.Label>
                <Form.Control
                  type="text"
                  name="END_COMPLETO"
                  value={currentItem.END_COMPLETO}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group controlId="formCodNode">
                <Form.Label>COD_NODE</Form.Label>
                <Form.Control
                  type="text"
                  name="COD_NODE"
                  value={currentItem.COD_NODE}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group controlId="formUf">
                <Form.Label>UF</Form.Label>
                <Form.Control
                  type="text"
                  name="UF"
                  value={currentItem.UF}
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

export default Cadastros;
