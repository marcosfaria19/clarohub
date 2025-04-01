// components/ProjectsFlowDashboard.jsx
import React, { useState } from "react";
import { Button } from "modules/shared/components/ui/button";
import { CirclePlusIcon, SettingsIcon } from "lucide-react";
import Container from "modules/shared/components/ui/container";

import { toast } from "sonner";
import useProjects from "modules/claroflow/hooks/useProjects";
import ProjectsSidebar from "./FlowSidebar";
import AddAssignment from "./AddAssignment";
import ProjectFlow from "./ProjectFlow";

const ProjectsFlowDashboard = () => {
  const {
    projects,
    loading,
    error,
    createAssignment,
    fetchProjects,
    editAssignment,
    deleteAssignment,
  } = useProjects();

  const [selectedProject, setSelectedProject] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState({
    projectId: "",
    name: "",
  });

  const handleAddAssignment = (projectId) => {
    setCurrentAssignment({
      projectId,
      name: "",
    });
    setShowAddModal(true);
  };

  const handleSaveAssignment = async () => {
    try {
      await createAssignment(
        currentAssignment.projectId,
        currentAssignment.name,
      );
      toast.success("Demanda criada com sucesso!");
      setShowAddModal(false);
      fetchProjects();
    } catch (error) {
      toast.error("Erro ao criar demanda");
    }
  };

  return (
    <Container>
      <div className="flex h-[calc(100vh-180px)]">
        {/* Sidebar com lista de projetos */}
        <ProjectsSidebar
          projects={projects}
          loading={loading}
          selectedProject={selectedProject}
          onSelectProject={setSelectedProject}
          onAddAssignment={handleAddAssignment}
        />

        {/* Área principal com fluxo visual */}
        <div className="flex flex-1 flex-col rounded-lg border">
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="text-xl font-semibold">
              {selectedProject ? selectedProject.name : "Selecione um projeto"}
            </h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <SettingsIcon className="mr-2 h-4 w-4" /> Configurações
              </Button>
              {selectedProject && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleAddAssignment(selectedProject._id)}
                >
                  <CirclePlusIcon className="mr-2 h-4 w-4" /> Nova Demanda
                </Button>
              )}
            </div>
          </div>

          {error ? (
            <div className="p-4 text-destructive">
              Erro ao carregar projetos: {error.message}
            </div>
          ) : selectedProject ? (
            <ProjectFlow
              project={selectedProject}
              onEditAssignment={editAssignment}
              onDeleteAssignment={deleteAssignment}
            />
          ) : (
            <div className="flex flex-1 items-center justify-center text-muted-foreground">
              Selecione um projeto para visualizar o fluxo de demandas
            </div>
          )}
        </div>
      </div>

      {/* Modal para adicionar nova demanda */}
      <AddAssignment
        show={showAddModal}
        handleClose={() => setShowAddModal(false)}
        handleSave={handleSaveAssignment}
        currentItem={currentAssignment}
        handleChange={(update) =>
          setCurrentAssignment((prev) => ({ ...prev, ...update }))
        }
        isEditMode={false}
        projects={projects.filter((p) => p._id === currentAssignment.projectId)}
      />
    </Container>
  );
};

export default ProjectsFlowDashboard;
