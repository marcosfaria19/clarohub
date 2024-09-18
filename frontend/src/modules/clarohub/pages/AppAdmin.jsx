import React, { useEffect, useMemo, useState } from "react";
import AddApp from "modules/clarohub/components/AddApp";
import { TabelaPadrao } from "modules/shared/components/TabelaPadrao";
import Container from "modules/shared/components/ui/container";
import axiosInstance from "services/axios";
import UserBadge from "../components/UserBadge";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import { Button } from "modules/shared/components/ui/button";
import { Card, CardContent } from "modules/shared/components/ui/card";
import { CirclePlusIcon } from "lucide-react";

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
    } catch (error) {
      console.error("Erro ao buscar dados do backend:", error);
    }
  };

  const handleEditClick = (item) => {
    setCurrentItem(item);
    setIsEditMode(true);
    setShowEditModal(true);
  };

  const handleAddClick = (item = null) => {
    if (item) {
      setCurrentItem(item);
      setIsEditMode(true);
    } else {
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
    }
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
        cell: ({ getValue }) => {
          const imageUrl = getValue();
          return imageUrl ? (
            <img
              src={`${process.env.REACT_APP_BACKEND_URL}${imageUrl}`}
              alt="logo"
              style={{ height: "50px" }}
            />
          ) : (
            <span>Sem logo</span>
          );
        },
      },
      {
        header: "NOME",
        accessorKey: "nome",
        sorted: true,
      },

      {
        header: "FAMILIA",
        accessorKey: "familia",
      },
      {
        header: "ACESSO",
        accessorKey: "acesso",
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
      <div className="flex justify-between">
        <h2 className="select-none text-3xl font-semibold text-foreground sm:mb-8 md:mb-10 lg:mb-12">
          Apps Cadastrados
        </h2>

        <Button variant="primary" onClick={handleAddClick}>
          <CirclePlusIcon className="mr-2" /> Adicionar
        </Button>
      </div>

      {/* Tabela Padrão */}
      <TabelaPadrao
        columns={columns}
        data={dados}
        actions
        onDelete={handleDeleteClick}
        onEdit={handleEditClick}
      />

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
      <DeleteConfirmationModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        handleDeleteConfirm={handleDeleteConfirm}
      />
    </Container>
  );
}

export default AppAdmin;
