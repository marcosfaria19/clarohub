import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Button,
  Modal,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
import "./AppAdmin.css";
import AddApp from "../components/AddApp";
import TabelaPadrao from "../components/TabelaPadrao";

function AppAdmin() {
  const [dados, setDados] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentItem, setCurrentItem] = useState({
    nome: "",
    imagemUrl: "",
    logoCard: "",
    logoList: "",
    rota: "",
    familia: "",
    acesso: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchDados();
  }, []);

  const fetchDados = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/apps`
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
      nome: "",
      imagemUrl: "",
      logoCard: "",
      logoList: "",
      rota: "",
      familia: "",
      acesso: "",
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
          `${process.env.REACT_APP_BACKEND_URL}/apps/${currentItem._id}`,
          currentItem
        );
      } else {
        await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/apps`,
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
        `${process.env.REACT_APP_BACKEND_URL}/apps/${currentItem._id}`
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

  // Definir as colunas para a tabela usando react-table
  const columns = React.useMemo(
    () => [
      {
        Header: "LOGO LISTA",
        accessor: "logoList",
        disableSortBy: false,
      },
      {
        Header: "NOME",
        accessor: "nome",
        disableSortBy: false,
      },

      {
        Header: "ROTA",
        accessor: "rota",
        Cell: ({ value }) => truncarTexto(value, 40), // Função para truncar o texto exibido
        disableSortBy: false,
      },
      {
        Header: "FAMILIA",
        accessor: "familia",

        disableSortBy: false,
      },
      {
        Header: "ACESSO",
        accessor: "acesso",
        disableSortBy: false,
      },

      {
        Header: "AÇÕES",
        accessor: "acoes",
        Cell: ({ row }) => (
          <div className="appadmin-acoes">
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
          <h3>Apps Cadastrados</h3>
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id="button-tooltip">Adicionar novo app</Tooltip>}
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

        <TabelaPadrao columns={columns} data={dados} />
      </div>

      {/* Modal de edição */}
      <AddApp
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
        <Modal.Body>Tem certeza que deseja excluir este app?</Modal.Body>
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

export default AppAdmin;
