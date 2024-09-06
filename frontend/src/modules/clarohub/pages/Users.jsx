import React, { useEffect, useMemo, useState } from "react";
import { Button, Modal, Tooltip, OverlayTrigger } from "react-bootstrap";
import "./Users.css";
import AddUsuario from "modules/clarohub/components/AddUsuario";
import { TabelaPadrao } from "modules/shared/components/TabelaPadrao";
import UserBadge from "modules/clarohub/components/UserBadge";
import axiosInstance from "services/axios";
import Container from "modules/shared/components/ui/container";

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
      const response = await axiosInstance.get(`/users`);
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
        await axiosInstance.put(`/users/${currentItem._id}`, currentItem);
      } else {
        await axiosInstance.post(`/users`, currentItem);
      }
      setShowEditModal(false);
      fetchDados();
    } catch (error) {
      console.error("Erro ao salvar dados:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await axiosInstance.delete(`/users/${currentItem._id}`);
      setShowDeleteModal(false);
      fetchDados();
    } catch (error) {
      console.error("Erro ao deletar dados:", error);
    }
  };

  const columns = useMemo(
    () => [
      {
        header: "LOGIN",
        accessorKey: "LOGIN",
        enableHiding: true,
      },
      {
        header: "NOME",
        accessorKey: "NOME",
        enableHiding: true,
      },
      {
        header: "GESTOR",
        accessorKey: "GESTOR",
        enableHiding: true,
      },
      {
        header: "ACESSO",
        accessorKey: "PERMISSOES",
        cell: ({ getValue }) => {
          const permission = getValue();
          return <UserBadge permission={permission} />;
        },
      },
    ],
    [],
  );

  return (
    <Container>
      <div>
        <h3 className="text-3xl">Usuários Cadastrados</h3>
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

      <TabelaPadrao
        columns={columns}
        data={dados}
        actions
        onDelete={handleDeleteClick}
        onEdit={handleEditClick}
      />

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
