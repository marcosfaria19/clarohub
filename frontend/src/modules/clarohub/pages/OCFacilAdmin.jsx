import React, { useEffect, useMemo, useState } from "react";
import axiosInstance from "services/axios";
import { TabelaPadrao } from "modules/shared/components/TabelaPadrao";
import Container from "modules/shared/components/ui/container";
import DeleteConfirmationModal from "modules/clarohub/components/DeleteConfirmationModal";
import AddQualinet from "modules/clarohub/components/AddQualinet";

const formatarData = (dataNumerica) => {
  const data = new Date((dataNumerica - 25569) * 86400 * 1000);
  const dia = data.getDate().toString().padStart(2, "0");
  const mes = (data.getMonth() + 1).toString().padStart(2, "0");
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
};

function OCFacilAdmin() {
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
      const response = await axiosInstance.get(`/ocqualinet`);
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
        await axiosInstance.put(`/ocqualinet/${currentItem._id}`, currentItem);
      } else {
        await axiosInstance.post(`/ocqualinet`, currentItem);
      }
      setShowEditModal(false);
      fetchDados();
    } catch (error) {
      console.error("Erro ao salvar dados:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await axiosInstance.delete(`/ocqualinet/${currentItem._id}`);
      setShowDeleteModal(false);
      fetchDados();
    } catch (error) {
      console.error("Erro ao deletar dados:", error);
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "CI_NOME",
        header: "CIDADE",
        sorted: true,
      },
      {
        accessorKey: "UF",
        header: "UF",
        sorted: true,
      },
      {
        header: "CONTRATO",
        accessorKey: "NUM_CONTRATO",
      },
      {
        accessorKey: "DT_CADASTRO",
        cell: (info) => formatarData(info.getValue()),
        header: "CADASTRO",
        sorted: true,
      },
      {
        header: "ENDEREÇO",
        accessorKey: "END_COMPLETO",
      },
      {
        header: "NODE",
        accessorKey: "COD_NODE",
      },
    ],
    [],
  );

  return (
    <Container>
      <h2 className="mb-6 select-none text-3xl font-semibold text-foreground sm:mb-8 md:mb-10 lg:mb-12">
        Dados Cadastrados
      </h2>

      <TabelaPadrao
        columns={columns}
        data={dados}
        actions
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      {/* Modal de edição */}
      <AddQualinet
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

export default OCFacilAdmin;
