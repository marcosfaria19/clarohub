import React, { useEffect, useMemo, useState } from "react";
import AddUsuario from "modules/clarohub/components/AddUsuario";
import { TabelaPadrao } from "modules/shared/components/TabelaPadrao";
import UserBadge from "modules/clarohub/components/UserBadge";
import axiosInstance from "services/axios";
import Container from "modules/shared/components/ui/container";
import DeleteConfirmationModal from "../../shared/components/DeleteConfirmationModal";
import { Button } from "modules/shared/components/ui/button";
import { CirclePlusIcon } from "lucide-react";
import { Avatar, AvatarImage } from "modules/shared/components/ui/avatar";

function Users() {
  const [dados, setDados] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentItem, setCurrentItem] = useState({
    LOGIN: "",
    AVATAR: "",
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
        header: "AVATAR",
        accessorKey: "avatar",
        enableHiding: true,
        cell: ({ row }) => {
          const user = row.original;
          return (
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.avatar} alt={user.NOME} />
            </Avatar>
          );
        },
      },
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
      <div className="flex justify-between">
        <h2 className="select-none text-3xl font-semibold text-foreground sm:mb-8 md:mb-10 lg:mb-12">
          Usuários Cadastrados
        </h2>

        <Button variant="primary" onClick={handleAddClick}>
          <CirclePlusIcon className="mr-2" /> Adicionar
        </Button>
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

      <DeleteConfirmationModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        handleDeleteConfirm={handleDeleteConfirm}
      />
    </Container>
  );
}

export default Users;
