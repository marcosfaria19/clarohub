import React, { useEffect, useState } from "react";
import {
  Container,
  Button,
  Modal,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
import "./NetSMSFacilAdmin.css";
import AddNetSMSFacil from "../components/AddNetSMSFacil";
import TabelaPadrao from "../components/TabelaPadrao";
import axiosInstance from "../services/axios";

function NetSMSFacilAdmin() {
  const [dados, setDados] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [filter, setFilter] = useState("");
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
      const response = await axiosInstance.get(`/netsmsfacil`);
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
        await axiosInstance.put(`/netsmsfacil/${currentItem._id}`, currentItem);
      } else {
        await axiosInstance.post(`/netsmsfacil`, currentItem);
      }
      setShowEditModal(false);
      fetchDados();
    } catch (error) {
      console.error("Erro ao salvar dados:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await axiosInstance.delete(`/netsmsfacil/${currentItem._id}`);
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

  // Definir as colunas para a tabela usando react-table
  const columns = React.useMemo(
    () => [
      {
        Header: "ID",
        accessor: "ID",
        disableSortBy: false, // Permitir ordenação nesta coluna
      },
      {
        Header: "TRATATIVA",
        accessor: "TRATATIVA",
        disableSortBy: false,
      },
      {
        Header: "TIPO",
        accessor: "TIPO",
        disableSortBy: false,
      },
      {
        Header: "ABERTURA/FECHAMENTO",
        accessor: "ABERTURA/FECHAMENTO",
        disableSortBy: false,
      },
      {
        Header: "NETSMS",
        accessor: "NETSMS",
        Cell: ({ value }) => truncarTexto(value, 40), // Função para truncar o texto exibido
        disableSortBy: false,
      },
      {
        Header: "TEXTO PADRÃO",
        accessor: "TEXTO PADRAO",
        Cell: ({ value }) => truncarTexto(value, 40),
        disableSortBy: false,
      },
      {
        Header: "OBS?",
        accessor: "OBS",
        disableSortBy: false,
      },
      {
        Header: "INC?",
        accessor: "INCIDENTE",
        disableSortBy: false,
      },
      {
        Header: "SGD",
        accessor: "SGD",
        Cell: ({ value }) =>
          truncarTexto(Array.isArray(value) ? value.join(" / ") : "", 3),
        disableSortBy: false,
      },
      {
        Header: "AÇÕES",
        accessor: "acoes",
        Cell: ({ row }) => (
          <div className="netsmsfacil-acoes">
            <Button
              variant="outline-dark"
              onClick={() => handleEditClick(row.original)}
              className="botaoEditar"
            >
              <i className="bi bi-pencil-square"></i>
            </Button>
            <Button
              variant="outline-danger"
              onClick={() => handleDeleteClick(row.original)}
              className="botaoDeletar"
            >
              <i className="bi bi-trash"></i>
            </Button>
          </div>
        ),
        disableSortBy: true,
      },
    ],
    [] // Depende apenas da inicialização
  );

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

        <TabelaPadrao
          columns={columns}
          data={dados}
          filter={filter}
          setFilter={setFilter}
        />
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