import React, { useContext } from "react";
import { Button } from "modules/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "modules/shared/components/ui/card";
import { Input } from "modules/shared/components/ui/input";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "modules/shared/components/ui/avatar";
import { SearchIcon, Users } from "lucide-react";
import { formatUserName } from "modules/shared/utils/formatUsername";
import { useUsers } from "modules/claroflow/hooks/useUsers";
import { ScrollArea } from "modules/shared/components/ui/scroll-area";
import { useMediaQuery } from "modules/shared/hooks/use-media-query";
import { cn } from "modules/shared/lib/utils";

import { TaskCard } from "./TaskCard";
import { AuthContext } from "modules/shared/contexts/AuthContext";
import { useTasks } from "modules/claroflow/hooks/useTasks";

export default function GenericBoard({ assignment, project }) {
  const { user } = useContext(AuthContext);
  const userId = user.userId;
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Hook de usuários por assignment
  const {
    users: teamMembers,
    loading: usersLoading,
    error: usersError,
  } = useUsers(assignment._id);

  // Hook de tarefas
  const {
    availableTasks,
    inProgressTasks,
    completedTasks,
    loadingAvailable,
    loadingInProgress,
    loadingCompleted,
    error,
    takeTask,
    refetchAvailableTasks,
    refetchInProgressTasks,
    refetchCompletedTasks,
  } = useTasks({ assignmentId: assignment._id, userId });

  const handleTakeTask = async () => {
    try {
      await takeTask(assignment._id);
      await Promise.all([refetchAvailableTasks(), refetchInProgressTasks()]);
    } catch (err) {
      console.error("Falha ao assumir tarefa:", err);
    }
  };

  return (
    <div
      className={cn(
        "flex h-[calc(100dvh-250px)] gap-4 overflow-hidden bg-background p-4",
        isMobile ? "flex-col" : "flex-row",
      )}
    >
      {/* Coluna Esquerda - Fila e Time */}
      <div
        className={cn(
          "flex flex-col gap-4",
          isMobile ? "h-[40vh] w-full" : "h-full w-[300px]",
        )}
      >
        {/* Card Fila de Tarefas */}
        <Card className="flex flex-col border-border bg-card">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-lg font-semibold text-card-foreground">
              Fila de {assignment?.name || "Carregando..."}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between p-4 pt-0">
            <span className="text-2xl font-medium text-card-foreground">
              {availableTasks?.length || 0}
            </span>
            <Button
              variant="default"
              size={isMobile ? "sm" : "default"}
              onClick={handleTakeTask}
              disabled={
                loadingAvailable ||
                availableTasks.length === 0 ||
                inProgressTasks?.length > 0
              }
            >
              {loadingAvailable
                ? "Processando..."
                : inProgressTasks?.length > 0
                  ? "Finalize a demanda atual"
                  : "Tratar →"}
            </Button>
          </CardContent>
        </Card>

        {/* Card Meu Time */}
        <Card className="flex-1 overflow-hidden border-border bg-card">
          <CardHeader className="p-4 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-card-foreground">
                Meu Time
              </CardTitle>
              <div className="flex items-center gap-2 pr-2 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{teamMembers.length}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-full p-4 pt-0">
            <ScrollArea className="h-full">
              <div className="space-y-2 pr-2">
                {usersLoading ? (
                  <div className="text-muted-foreground">Carregando...</div>
                ) : usersError ? (
                  <div className="text-destructive">
                    Erro ao carregar usuários
                  </div>
                ) : (
                  teamMembers.map((user) => (
                    <Card
                      key={user._id}
                      className="bg-background p-2 shadow-sm transition-colors hover:bg-accent/30"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border-2 border-background">
                          <AvatarImage src={user.avatar} alt={user.NOME} />
                          <AvatarFallback className="bg-secondary text-accent">
                            {user.NOME.split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-card-foreground">
                          {formatUserName(user.NOME)}
                        </span>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Colunas Direitas - Em Tratamento e Finalizadas */}
      <div
        className={cn(
          "flex flex-1 gap-4 overflow-hidden",
          isMobile ? "h-[60vh] flex-col" : "h-full flex-row",
        )}
      >
        {/* Coluna Em Tratamento */}
        <div className="flex flex-1 flex-col gap-4 overflow-hidden">
          <Card className="border-border bg-card">
            <CardHeader className="flex h-[70px] p-4">
              <CardTitle className="text-lg font-semibold text-card-foreground">
                Em Tratamento ({inProgressTasks?.length || 0})
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="flex-1 overflow-hidden border-border bg-card">
            <ScrollArea className="h-full">
              <CardContent className="space-y-4 p-4">
                {inProgressTasks?.length > 0 ? (
                  inProgressTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      project={project}
                      task={task}
                      assignment={assignment}
                      onTransition={() => {
                        refetchInProgressTasks();
                        refetchCompletedTasks();
                      }}
                    />
                  ))
                ) : loadingInProgress ? (
                  <div className="text-muted-foreground">Carregando...</div>
                ) : (
                  <div className="text-muted-foreground">
                    Nenhuma demanda em tratamento
                  </div>
                )}
              </CardContent>
            </ScrollArea>
          </Card>
        </div>

        {/* Coluna Finalizadas */}
        <div className="flex flex-1 flex-col gap-4 overflow-hidden">
          <Card className="border-border bg-card">
            <CardHeader className="flex h-[70px] items-center p-4">
              <div className="flex w-full items-center justify-between gap-2 max-md:flex-col">
                <CardTitle className="text-lg font-semibold text-card-foreground">
                  Finalizadas ({completedTasks?.length || 0})
                </CardTitle>
                <div className="relative w-full md:w-48">
                  <Input
                    placeholder="Buscar finalizadas..."
                    className="w-full bg-background p-2"
                    size={isMobile ? "sm" : "default"}
                  />
                  <SearchIcon className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="flex-1 overflow-hidden border-border bg-card">
            <ScrollArea className="h-full">
              <CardContent className="space-y-4 p-4">
                {completedTasks?.length > 0 ? (
                  completedTasks.map((task) => (
                    <TaskCard key={task._id} task={task} isCompleted />
                  ))
                ) : loadingCompleted ? (
                  <div className="text-muted-foreground">Carregando...</div>
                ) : (
                  <div className="text-muted-foreground">
                    Nenhuma demanda finalizada
                  </div>
                )}
              </CardContent>
            </ScrollArea>
          </Card>
        </div>
      </div>
    </div>
  );
}
