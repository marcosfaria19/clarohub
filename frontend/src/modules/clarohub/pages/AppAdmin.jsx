import React, { useEffect, useMemo, useState } from "react";
import { Button, Modal, Tooltip, OverlayTrigger } from "react-bootstrap";
import AddApp from "modules/clarohub/components/AddApp";
import { TabelaPadrao } from "modules/shared/components/TabelaPadrao";
import Container from "modules/shared/components/ui/container";
import axiosInstance from "services/axios";

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
      const response = await axiosInstance.get(`/apps`, {});
      setDados(response.data);
      console.log(response.data);
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
        await axiosInstance.put(`/apps/${currentItem._id}`, currentItem);
      } else {
        await axiosInstance.post(`/apps`, currentItem);
      }
      setShowEditModal(false);
      fetchDados();
    } catch (error) {
      console.error("Erro ao salvar dados:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await axiosInstance.delete(`/apps/${currentItem._id}`);
      setShowDeleteModal(false);
      fetchDados();
    } catch (error) {
      console.error("Erro ao deletar dados:", error);
    }
  };

  const columns = useMemo(
    () => [
      {
        header: "LOGO LISTA",
        accessorKey: "logoList",
      },
      {
        header: "NOME",
        accessorKey: "nome",
      },

      {
        header: "ROTA",
        accessorKey: "rota",
      },
      {
        header: "FAMILIA",
        accessorKey: "familia",
      },
      {
        header: "ACESSO",
        accessorKey: "acesso",
      },

      {
        header: "AÇÕES",
        accessorKey: "acoes",
      },
    ],
    [],
  );

  return (
    <Container>
      <div>
        <h2 className="select-none text-3xl">Apps Cadastrados</h2>
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
