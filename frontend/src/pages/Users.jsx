import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Button,
  Modal,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
import "./Users.css";
import AddUsuario from "../components/AddUsuario";
import TabelaPadrao from "../components/TabelaPadrao";
import UserBadge from "../components/UserBadge";

function Users() {
  const [dados, setDados] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentItem, setCurrentItem] = useState({
    LOGIN: "",
    NOME: "",
    GESTOR: "",
    PERMISSOES: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchDados();
  }, []);

  const fetchDados = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/users`
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
      LOGIN: "",
      NOME: "",
      GESTOR: "",
      PERMISSOES: "",
    });
    setIsEditMode(false);
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
  };

  const handleDeleteClick = (item) => {
    setCurrentItem(item);
    setShowDeleteModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentItem((prevItem) => ({ ...prevItem, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (isEditMode) {
        await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/users/${currentItem._id}`,
          currentItem
        );
      } else {
        await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/users`,
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
        `${process.env.REACT_APP_BACKEND_URL}/users/${currentItem._id}`
      );
      setShowDeleteModal(false);
      fetchDados();
    } catch (error) {
      console.error("Erro ao deletar dados:", error);
    }
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "LOGIN",
        accessor: "LOGIN",
        disableSortBy: false,
      },
      {
        Header: "NOME",
        accessor: "NOME",
        disableSortBy: false,
      },
      {
        Header: "GESTOR",
        accessor: "GESTOR",
        disableSortBy: false,
      },
      {
        Header: "ACESSO",
        accessor: "PERMISSOES",
        disableSortBy: false,
        Cell: ({ value }) => <UserBadge permission={value} />,
      },
      {
        Header: "AÇÕES",
        accessor: "acoes",
        Cell: ({ row }) => (
          <div className="acoes">
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
    []
  );

  return (
    <Container className="users-container">
      <div className="mt-4">
        <div className="users-titulo">
          <h3>Usuários Cadastrados</h3>
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id="button-tooltip">Adicionar novo usuário</Tooltip>
            }
          >
            <Button
              variant="outline-dark"
              className="botao-adicionarUsuario"
              onClick={handleAddClick}
            >
              <i className="bi bi-plus-lg"></i>
            </Button>
          </OverlayTrigger>
        </div>

        <TabelaPadrao columns={columns} data={dados} />
      </div>

      <AddUsuario
        show={showEditModal}
        handleClose={handleCloseModal}
        handleSave={handleSave}
        currentItem={currentItem}
        handleChange={handleChange}
        isEditMode={isEditMode}
      />

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
