import React, { useEffect, useState } from "react";
import { Button } from "modules/shared/components/ui/button";
import { CirclePlusIcon } from "lucide-react";
import { toast } from "sonner";
import useProjects from "modules/claroflow/hooks/useProjects";
import AddAssignment from "./AddAssignment";
import ProjectFlow from "./ProjectFlow";
import ProjectsSidebar from "./ProjectsSidebar";

export default function ProjectsFlowDashboard() {
  const {
    projects,
    loading,
    error,
    createAssignment,
    editAssignment,
    deleteAssignment,
  } = useProjects();

  const [isEditMode, setIsEditMode] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState({
    projectId: "",
    assignmentId: "",
    name: "",
  });

  const [selectedProject, setSelectedProject] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    if (projects.length > 0 && selectedProject) {
      const updatedProject = projects.find(
        (p) => p._id === selectedProject._id,
      );
      setSelectedProject(updatedProject);
    }
  }, [projects, selectedProject]);

  const handleAddAssignment = (projectId) => {
    setCurrentAssignment({ projectId, name: "" });
    setIsEditMode(false);
    setShowAddModal(true);
  };

  const handleEditAssignment = (assignment) => {
    setCurrentAssignment({
      projectId: selectedProject._id,
      assignmentId: assignment._id,
      name: assignment.name,
    });
    setIsEditMode(true);
    setShowAddModal(true);
  };

  const handleSaveAssignment = async () => {
    try {
      if (isEditMode) {
        await editAssignment(
          currentAssignment.projectId,
          currentAssignment.assignmentId,
          { name: currentAssignment.name },
        );
      } else {
        await createAssignment(
          currentAssignment.projectId,
          currentAssignment.name,
        );
      }

      const updatedProject = projects.find(
        (p) => p._id === currentAssignment.projectId,
      );
      setSelectedProject(updatedProject);

      setShowAddModal(false);
      toast.success("Alterações salvas!");
    } catch (error) {
      toast.error("Erro ao salvar demanda");
    }
  };

  return (
    <div className="flex h-[calc(100dvh-250px)] gap-4 bg-background p-4">
      <ProjectsSidebar
        projects={projects}
        loading={loading}
        selectedProject={selectedProject}
        onSelectProject={setSelectedProject}
        onAddAssignment={handleAddAssignment}
      />

      <div className="flex flex-1 flex-col overflow-hidden rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-lg font-semibold text-card-foreground">
            {selectedProject ? selectedProject.name : "Selecione um projeto"}
          </h2>
          {selectedProject && (
            <Button
              variant="default"
              size="sm"
              onClick={() => handleAddAssignment(selectedProject._id)}
            >
              <CirclePlusIcon className="mr-2 h-4 w-4" /> Nova Demanda
            </Button>
          )}
        </div>

        <div className="flex-1 overflow-auto p-4">
          {error ? (
            <div className="text-destructive">
              Erro ao carregar projetos: {error.message}
            </div>
          ) : selectedProject ? (
            <ProjectFlow
              project={selectedProject}
              onEditAssignment={handleEditAssignment}
              onDeleteAssignment={deleteAssignment}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              Selecione um projeto para visualizar o fluxo de demandas
            </div>
          )}
        </div>
      </div>

      <AddAssignment
        show={showAddModal}
        isEditMode={isEditMode}
        handleClose={() => setShowAddModal(false)}
        handleSave={handleSaveAssignment}
        currentItem={currentAssignment}
        handleChange={(update) => {
          setCurrentAssignment((prev) => ({
            ...prev,
            ...update,
          }));
        }}
        projects={projects.filter((p) => p._id === currentAssignment.projectId)}
      />
    </div>
  );
}
