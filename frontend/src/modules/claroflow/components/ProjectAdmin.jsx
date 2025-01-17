import React, { useEffect, useMemo, useState } from "react";
import { TabelaPadrao } from "modules/shared/components/TabelaPadrao";
import Container from "modules/shared/components/ui/container";
import { Button } from "modules/shared/components/ui/button";
import { CirclePlusIcon } from "lucide-react";
import AddAssignment from "./AddAssignment";
import { useProjects } from "../hooks/useProjects";
import DeleteConfirmationModal from "modules/shared/components/DeleteConfirmationModal";

function ProjectAdmin() {
  const {
    assignments,
    fetchAssignments,
    addAssignmentToProject,
    deleteAssignment,
  } = useProjects();

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentItem, setCurrentItem] = useState({
    name: "",
    project: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleEditClick = (item) => {
    setCurrentItem({ ...item });
    setIsEditMode(true);
    setShowEditModal(true);
  };

  const handleAddClick = () => {
    setCurrentItem({
      name: "",
      project: "",
    });
    setIsEditMode(false);
    setShowEditModal(true);
  };

  const handleDeleteClick = (item) => {
    setCurrentItem({ ...item });
    setShowDeleteModal(true);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target ? e.target : { name: e, value: e };
    setCurrentItem((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await addAssignmentToProject(currentItem.project, {
        name: currentItem.name,
      });
      setShowEditModal(false);
    } catch (err) {
      console.error("Erro ao salvar demanda:", err);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteAssignment(currentItem._id);
      setShowDeleteModal(false);
    } catch (err) {
      console.error("Erro ao deletar demanda:", err);
    }
  };

  const columns = useMemo(
    () => [
      {
        header: "Demanda",
        accessorKey: "name",
        sorted: true,
      },
      {
        header: "Projeto",
        accessorKey: "project",
      },
    ],
    [],
  );

  return (
    <Container>
      <div className="flex justify-between">
        <h2 className="select-none text-3xl font-semibold text-foreground sm:mb-8 md:mb-10 lg:mb-12">
          Demandas Cadastradas
        </h2>

        <Button variant="primary" onClick={handleAddClick}>
          <CirclePlusIcon className="mr-2" /> Adicionar
        </Button>
      </div>

      <TabelaPadrao
        columns={columns}
        data={assignments} // Use assignments carregados do hook
        actions
        onDelete={handleDeleteClick}
        onEdit={handleEditClick}
      />

      <AddAssignment
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

export default ProjectAdmin;
