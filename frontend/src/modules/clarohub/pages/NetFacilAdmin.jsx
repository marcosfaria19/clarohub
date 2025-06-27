import React, { useEffect, useMemo, useState } from "react";
import AddNetFacil from "modules/clarohub/components/netfacil/AddNetFacil";
import axiosInstance from "services/axios";
import { TabelaPadrao } from "modules/shared/components/TabelaPadrao";
import Container from "modules/shared/components/ui/container";
import DeleteConfirmationModal from "modules/shared/components/DeleteConfirmationModal";
import { Button } from "modules/shared/components/ui/button";
import { CirclePlusIcon } from "lucide-react";

function NetFacilAdmin() {
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
      <div className="flex justify-between">
        <h2 className="select-none text-3xl font-semibold text-foreground sm:mb-8 md:mb-10 lg:mb-12">
          Códigos Cadastrados
        </h2>

        <Button variant="primary" onClick={handleAddClick}>
          <CirclePlusIcon className="mr-2" /> Adicionar
        </Button>
      </div>

      <TabelaPadrao
        columns={columns}
        data={dados}
        actions
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      {/* Modal de edição */}
      <AddNetFacil
        show={showEditModal}
        handleClose={handleCloseModal}
        handleSave={handleSave}
        currentItem={currentItem}
        handleChange={handleChange}
        isEditMode={isEditMode}
      />

      {/* Modal de Confirmação de Exclusão */}
      <DeleteConfirmationModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        handleDeleteConfirm={handleDeleteConfirm}
      />
    </Container>
  );
}

export default NetFacilAdmin;
