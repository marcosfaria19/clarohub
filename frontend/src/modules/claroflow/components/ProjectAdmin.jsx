import React, { useMemo, useState } from "react";
import { TabelaPadrao } from "modules/shared/components/TabelaPadrao";
import Container from "modules/shared/components/ui/container";
import { Button } from "modules/shared/components/ui/button";
import { CirclePlusIcon } from "lucide-react";
import AddAssignment from "./AddAssignment";
import useProjects from "../hooks/useProjects";
import DeleteConfirmationModal from "modules/shared/components/DeleteConfirmationModal";

function ProjectAdmin() {
  const {
    projects,
    loading,
    error,
    createAssignment,
    fetchProjects,
    editAssignment,
    deleteAssignment,
  } = useProjects();

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentItem, setCurrentItem] = useState({
    project: "",
    name: "",
    projectId: "",
    assignmentId: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);

  const handleAddClick = () => {
    setCurrentItem({
      project: "",
      name: "",
      projectId: "",
      assignmentId: "",
    });
    setIsEditMode(false);
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
  };

  const handleEditClick = (item) => {
    setIsEditMode(true);
    setShowEditModal(true);
    setCurrentItem({
      ...item,
      name: item.assignment,
    });
  };

  const handleChange = ({ name, value }) => {
    setCurrentItem((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      if (isEditMode) {
        if (!currentItem.projectId || !currentItem.assignmentId) {
          console.error(
            "ID do projeto ou da demanda não fornecido para edição",
          );
          return;
        }
        await editAssignment(
          currentItem.projectId,
          currentItem.assignmentId,
          currentItem.name,
        );
      } else {
        if (!currentItem.projectId) {
          console.error("ID do projeto não fornecido para criação");
          return;
        }
        await createAssignment(currentItem.projectId, currentItem.name);
      }
      setShowEditModal(false);
      fetchProjects();
    } catch (err) {
      console.error("Erro ao salvar demanda:", err);
    }
  };

  const handleDeleteClick = (item) => {
    setCurrentItem(item);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteAssignment(currentItem.projectId, currentItem.assignmentId);
      setShowDeleteModal(false);
      fetchProjects();
    } catch (err) {
      console.error("Erro ao excluir demanda:", err);
    }
  };

  const columns = useMemo(
    () => [
      {
        header: "Projeto",
        accessorKey: "project",
      },
      {
        header: "Demanda",
        accessorKey: "assignment",
      },
    ],
    [],
  );

  const flatProjects = useMemo(() => {
    return projects.reduce((acc, project) => {
      if (project.assignments && project.assignments.length > 0) {
        project.assignments.forEach((assignment) => {
          acc.push({
            project: project.name,
            projectId: project._id,
            assignment: assignment.name,
            assignmentId: assignment._id,
          });
        });
      }
      return acc;
    }, []);
  }, [projects]);

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

      {error ? (
        <p className="text-destructive">Erro ao carregar projetos.</p>
      ) : (
        <TabelaPadrao
          columns={columns}
          data={flatProjects}
          actions
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          loading={loading}
          columnFilter={false}
        />
      )}

      <AddAssignment
        show={showEditModal}
        handleClose={handleCloseModal}
        handleSave={handleSave}
        currentItem={currentItem}
        handleChange={handleChange}
        isEditMode={isEditMode}
        projects={projects}
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
