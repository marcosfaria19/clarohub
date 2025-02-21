// src/pages/Claroflow.jsx
import React, { useContext, useEffect, useState } from "react";
import Container from "modules/shared/components/ui/container";
import FlowMenu from "../components/FlowMenu";
import { FlowHome } from "../components/FlowHome";
import { AuthContext } from "modules/shared/contexts/AuthContext";
import { useUsers } from "../hooks/useUsers";
import { getBoardComponent } from "../utils/boardRegistry";

import { UploadCloudIcon, UploadIcon } from "lucide-react";
import { Button } from "modules/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "modules/shared/components/ui/dialog";
import MDUpload from "../components/upload-data/MDUUpload";

export default function Claroflow() {
  const { user } = useContext(AuthContext);
  const { fetchUserAssignments, getUserProjectId } = useUsers();
  const [state, setState] = useState({
    projectId: null,
    assignments: [],
    selectedTab: "home",
    showUpload: false,
  });

  useEffect(() => {
    const loadData = async () => {
      const project = await getUserProjectId(user.userId);
      const assignments = await fetchUserAssignments(user.userId);
      setState((prev) => ({ ...prev, projectId: project, assignments }));
    };
    loadData();
  }, [user.userId, getUserProjectId, fetchUserAssignments]);

  const BoardComponent = getBoardComponent(state.selectedTab);

  return (
    <Container innerClassName="max-w-[95vw] mb-4">
      <FlowMenu
        assignments={state.assignments}
        activeTab={state.selectedTab}
        onTabChange={(tab) =>
          setState((prev) => ({ ...prev, selectedTab: tab }))
        }
      />

      <div className="min-h-[75vh] w-full rounded-lg rounded-tl-none bg-board drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)]">
        {state.selectedTab === "home" ? (
          <FlowHome
            userId={user.userId}
            projectId={state.projectId}
            gestor={user.gestor}
            assignments={state.assignments}
          />
        ) : (
          <BoardComponent
            assignmentId={state.selectedTab}
            projectId={state.projectId}
            assignment={state.assignments.find(
              (a) => a._id === state.selectedTab,
            )}
          />
        )}
      </div>

      {/* Floating Action Button */}
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

      {/* Upload Dialog */}
      <Dialog
        open={state.showUpload}
        onOpenChange={(open) =>
          setState((prev) => ({ ...prev, showUpload: open }))
        }
      >
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UploadCloudIcon className="h-6 w-6 text-primary" />
              Importação de Dados - MDU
            </DialogTitle>
            <DialogDescription>
              Faça upload da extração de ocorrências do SGD.
            </DialogDescription>
          </DialogHeader>
          <MDUpload
            onClose={() => setState((prev) => ({ ...prev, showUpload: false }))}
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
}
