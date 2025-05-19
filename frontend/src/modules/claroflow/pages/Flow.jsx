import React, { useContext, useEffect, useState } from "react";
import Container from "modules/shared/components/ui/container";
import FlowMenu from "../components/FlowMenu";
import { FlowHome } from "../components/FlowHome";
import { AuthContext } from "modules/shared/contexts/AuthContext";
import { useUsers } from "../hooks/useUsers";
import BoardLayout from "../components/tasks/BoardLayout";
import { UploadCloudIcon, UploadIcon } from "lucide-react";
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
  const { fetchProjectById } = useProjects();
  const [state, setState] = useState({
    project: null,
    assignments: [],
    selectedTab: "home",
    showUpload: false,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [project, assignments] = await Promise.all([
          fetchProjectById(user.project._id),
          fetchUserAssignments(user.userId),
        ]);

        setState((prev) => ({
          ...prev,
          project,
          assignments,
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
  }, [user.userId, user.project._id, fetchProjectById, fetchUserAssignments]);

  if (state.loading) return <div>Carregando...</div>;
  if (state.error) return <div>Erro: {state.error}</div>;

  return (
    <Container innerClassName="max-w-[95vw] mb-4">
      <FlowMenu
        role={user.permissoes}
        assignments={state.assignments}
        activeTab={state.selectedTab}
        onTabChange={(tab) =>
          setState((prev) => ({ ...prev, selectedTab: tab }))
        }
      />

      <div className="min-h-[75vh] w-full rounded-lg rounded-tl-none drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)]">
        {state.project ? (
          state.selectedTab === "home" ? (
            <FlowHome project={state.project} />
          ) : state.selectedTab === "team" ? (
            <AssignmentBoard project={state.project} />
          ) : state.selectedTab === "projectflow" ? (
            <ProjectsFlowDashboard />
          ) : (
            <BoardLayout
              assignmentId={state.selectedTab}
              project={state.project}
              assignment={state.assignments.find(
                (a) => a._id === state.selectedTab,
              )}
            />
          )
        ) : (
          <LoadingSpinner />
        )}
      </div>

      {state.selectedTab === "home" && (
        <div className="animate-fade-in-up fixed bottom-24 right-28 z-50">
          <Button
            variant="default"
            size="lg"
            className="gap-2 shadow-lg transition-shadow hover:shadow-xl"
            onClick={() => setState((prev) => ({ ...prev, showUpload: true }))}
          >
            <UploadIcon className="h-5 w-5" />
            Nova Importação
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
