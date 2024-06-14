import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Table,
  Button,
  Modal,
  Form,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
import "./NetSMSFacilAdmin.css";
import AddNetSMSFacil from "../components/AddNetSMSFacil";

function NetSMSFacilAdmin() {
  const [dados, setDados] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentItem, setCurrentItem] = useState({
    ID: "",
    TRATATIVA: "",
    TIPO: "",
    "ABERTURA/FECHAMENTO": "",
    NETSMS: "",
    "TEXTO PADRAO": "",
    OBS: "0",
    INCIDENTE: "0",
  });
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchDados();
  }, []);

  const fetchDados = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/netsmsfacil`
      );
      setDados(response.data);
    } catch (error) {
      console.error("Erro ao buscar dados do backend:", error);
    }
  };

  const handleEditClick = (item) => {
    setCurrentItem(item);
    setIsEditMode(true);
    setShowEditModal(true);
  };

  const handleAddClick = () => {
    setCurrentItem({
      ID: "",
      TRATATIVA: "",
      TIPO: "",
      "ABERTURA/FECHAMENTO": "",
      NETSMS: "",
      "TEXTO PADRAO": "",
      OBS: "0",
      INCIDENTE: "0",
    });
    setIsEditMode(false);
    setShowEditModal(true);
  };

  const handleDeleteClick = (item) => {
    setCurrentItem(item);
    setShowDeleteModal(true);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentItem((prevItem) => ({ ...prevItem, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (isEditMode) {
        await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/netsmsfacil/${currentItem._id}`,
          currentItem
        );
      } else {
        await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/netsmsfacil`,
          currentItem
        );
      }
      setShowEditModal(false);
      fetchDados();
    } catch (error) {
      console.error("Erro ao salvar dados:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/netsmsfacil/${currentItem._id}`
      );
      setShowDeleteModal(false);
      fetchDados();
    } catch (error) {
      console.error("Erro ao deletar dados:", error);
    }
  };

  const truncarTexto = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  return (
    <Container className="netsmsadmin-container">
      <div className="mt-4">
        <div className="netsmsadmin-titulo">
          <h3>Códigos Cadastrados</h3>
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id="button-tooltip">Adicionar novo código</Tooltip>
            }
          >
            <Button
              variant="outline-dark"
              className="botao-adicionar"
              onClick={handleAddClick}
            >
              <i className="bi bi-plus-lg"></i>
            </Button>
          </OverlayTrigger>
        </div>

        <Table bordered hover className="mt-4 netsmsadmin-table">
          <thead>
            <tr>
              <th className="text-center">ID</th>
              <th className="text-center">TRATATIVA</th>
              <th className="text-center">TIPO</th>
              <th className="text-center">ABERTURA/FECHAMENTO</th>
              <th className="text-center">NETSMS</th>
              <th className="text-center">TEXTO PADRÃO</th>
              <th className="text-center">OBS?</th>
              <th className="text-center">INC?</th>
              <th className="text-center">AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {dados.map((item, index) => (
              <tr key={index}>
                <td className="text-center">{item.ID}</td>
                <td className="text-center">{item.TRATATIVA}</td>
                <td className="text-center">{item.TIPO}</td>
                <td className="text-center">{item["ABERTURA/FECHAMENTO"]}</td>
                <td className="text-center">{truncarTexto(item.NETSMS, 40)}</td>
                <td className="text-center">
                  {truncarTexto(item["TEXTO PADRAO"], 40)}
                </td>
                <td className="text-center">{item.OBS}</td>
                <td className="text-center">{item.INCIDENTE}</td>
                <td className="text-center netsmsfacil-acoes">
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

      {/* Modal de edição */}
      <AddNetSMSFacil
        show={showEditModal}
        handleClose={handleCloseModal}
        handleSave={handleSave}
        currentItem={currentItem}
        handleChange={handleChange}
        isEditMode={isEditMode}
      />

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

export default NetSMSFacilAdmin;
