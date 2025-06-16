import React, { useContext, useEffect, useMemo, useState } from "react";
import Container from "modules/shared/components/ui/container";
import FlowMenu from "../components/FlowMenu";
import { FlowHome } from "../components/FlowHome";
import { AuthContext } from "modules/shared/contexts/AuthContext";
import { useUsers } from "../hooks/useUsers";
import BoardLayout from "../components/tasks/BoardLayout";
import { Plus, UploadCloudIcon } from "lucide-react";
import { Button } from "modules/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "modules/shared/components/ui/dialog";
import LoadingSpinner from "modules/clarospark/components/LoadingSpinner";
import AssignmentBoard from "./TeamBoard";
import TasksUpload from "../components/upload/TasksUpload";
import useProjects from "../hooks/useProjects";
import ProjectsFlowDashboard from "../components/projects/ProjectFlowDashboard";

export default function Claroflow() {
  const { user } = useContext(AuthContext);
  const { fetchUserAssignments } = useUsers();
  const { fetchProjects, fetchProjectById } = useProjects();

  const [state, setState] = useState({
    projects: [],
    assignments: [],
    selectedTab: "home",
    showUpload: false,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        let projectsData = [];
        let assignmentsData = [];

        if (user.roles_adicionais?.includes("supervisor")) {
          // Supervisor: carrega todos os projetos
          projectsData = await fetchProjects();
        } else {
          // Usuário normal: carrega apenas seu projeto
          const userProject = await fetchProjectById(user.project._id);
          projectsData = userProject ? [userProject] : [];
        }

        assignmentsData = await fetchUserAssignments(user.userId);

        setState((prev) => ({
          ...prev,
          projects: projectsData,
          assignments: assignmentsData,
          loading: false,
          error: null,
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: "Erro ao carregar dados do projeto",
        }));
      }
    };

    loadData();
  }, [
    user.userId,
    user.project._id,
    user.roles_adicionais,
    fetchProjectById,
    fetchUserAssignments,
    fetchProjects,
  ]);

  const selectedProject = useMemo(() => {
    if (state.selectedTab.startsWith("team-")) {
      const projectId = state.selectedTab.split("-")[1];
      return state.projects.find((p) => p._id === projectId);
    }
    return state.projects[0];
  }, [state.selectedTab, state.projects]);

  if (state.loading) return <div>Carregando...</div>;
  if (state.error) return <div>Erro: {state.error}</div>;

  return (
    <Container innerClassName="max-w-[95vw] mb-4">
      <FlowMenu
        role={user.permissoes}
        projects={state.projects}
        assignments={state.assignments}
        activeTab={state.selectedTab}
        additionalRoles={user.roles_adicionais || []}
        onTabChange={(tab) =>
          setState((prev) => ({ ...prev, selectedTab: tab }))
        }
      />

      <div className="min-h-[75vh] w-full rounded-lg rounded-tl-none drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)]">
        {state.projects.length > 0 ? (
          state.selectedTab === "home" ? (
            <FlowHome project={selectedProject} />
          ) : state.selectedTab.startsWith("team-") ? (
            selectedProject ? (
              <AssignmentBoard project={selectedProject} />
            ) : null
          ) : state.selectedTab === "projectflow" ? (
            <ProjectsFlowDashboard />
          ) : (
            <BoardLayout
              assignmentId={state.selectedTab}
              project={user.project}
              assignment={state.assignments.find(
                (a) => a._id === state.selectedTab,
              )}
            />
          )
        ) : (
          <LoadingSpinner />
        )}
      </div>

      {state.selectedTab === "home" &&
        user.roles_adicionais?.includes("flow_upload") && (
          <div className="fixed bottom-6 right-6 z-50 md:bottom-10 md:right-10">
            <Button
              variant="default"
              size="lg"
              className="flex items-center gap-2 rounded-full shadow-lg hover:shadow-xl"
              onClick={() =>
                setState((prev) => ({ ...prev, showUpload: true }))
              }
            >
              <Plus className="h-5 w-5" />
              <span className="hidden sm:inline">Nova Importação</span>
            </Button>
          </div>
        )}

      <Dialog
        open={state.showUpload}
        onOpenChange={(open) =>
          setState((prev) => ({ ...prev, showUpload: open }))
        }
      >
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader className="py-0">
            <DialogTitle className="flex items-center gap-2">
              <UploadCloudIcon className="h-6 w-6 text-primary" />
              Importação de Dados
            </DialogTitle>
            <DialogDescription>
              Faça upload da extração do projeto correspondente.
            </DialogDescription>
          </DialogHeader>
          <TasksUpload
            onClose={() => setState((prev) => ({ ...prev, showUpload: false }))}
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
}
