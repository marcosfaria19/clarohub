import React, { useEffect, useMemo, useState } from "react";
import { Button, Modal, Tooltip, OverlayTrigger } from "react-bootstrap";
import AddNetSMSFacil from "modules/clarohub/components/AddNetSMSFacil";
import axiosInstance from "services/axios";
import { TabelaPadrao } from "modules/shared/components/TabelaPadrao";
import Container from "modules/shared/components/ui/container";

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

  const columns = useMemo(
    () => [
      {
        id: "id",
        header: "ID",
        accessorKey: "ID",
        sorted: true,
      },
      {
        header: "TRATATIVA",
        accessorKey: "TRATATIVA",
        sorted: true,
      },
      {
        header: "TIPO",
        accessorKey: "TIPO",
        sorted: true,
      },
      {
        header: "ABERTURA/FECHAMENTO",
        accessorKey: "ABERTURA/FECHAMENTO",
      },
      {
        header: "NETSMS",
        accessorKey: "NETSMS",
      },
      {
        header: "TEXTO PADRÃO",
        accessorKey: "TEXTO PADRAO",
      },
      {
        header: "OBS",
        accessorKey: "OBS",
      },
      {
        header: "INC",
        accessorKey: "INCIDENTE",
      },
      {
        header: "SGD",
        accessorKey: "SGD",
        Cell: ({ value }) =>
          truncarTexto(Array.isArray(value) ? value.join(" / ") : "", 3),
      },
    ],
    [],
  );

  return (
    <Container>
      <h2 className="mb-6 select-none text-3xl font-semibold text-foreground sm:mb-8 md:mb-10 lg:mb-12">
        Códigos Cadastrados
      </h2>
      <OverlayTrigger
        placement="top"
        overlay={<Tooltip id="button-tooltip">Adicionar novo código</Tooltip>}
      >
        <Button
          variant="outline-dark"
          className="botao-adicionar"
          onClick={handleAddClick}
        >
          <i className="bi bi-plus-lg"></i>
        </Button>
      </OverlayTrigger>

      <TabelaPadrao
        columns={columns}
        data={dados}
        actions
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

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
