import { useContext, useEffect, useState } from "react";
import { Button } from "modules/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "modules/shared/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "modules/shared/components/ui/avatar";
import { Badge } from "modules/shared/components/ui/badge";
import { ScrollArea } from "modules/shared/components/ui/scroll-area";
import {
  Users,
  Inbox,
  Clock,
  CheckCircle2,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { formatUserName } from "modules/shared/utils/formatUsername";
import { useUsers } from "modules/claroflow/hooks/useUsers";
import { useMediaQuery } from "modules/shared/hooks/use-media-query";
import { cn } from "modules/shared/lib/utils";

import { TaskCard } from "./TaskCard";
import { AuthContext } from "modules/shared/contexts/AuthContext";
import { useTasks } from "modules/claroflow/hooks/useTasks";
import FinishedTaskFilter from "./FinishedTaskFilter";

export default function GenericBoard({ assignment, project }) {
  const { user } = useContext(AuthContext);
  const userId = user.userId;
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Hook for users by assignment
  const {
    users: teamMembers,
    loading: usersLoading,
    error: usersError,
  } = useUsers(assignment._id);

  // Hook for tasks
  const {
    availableTasks,
    inProgressTasks,
    completedTasks,
    loadingAvailable,
    loadingInProgress,
    loadingCompleted,
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

  // Filter for completed tasks
  const [filteredCompletedTasks, setFilteredCompletedTasks] =
    useState(completedTasks);

  useEffect(() => {
    setFilteredCompletedTasks(completedTasks);
  }, [completedTasks]);

  return (
    <div
      className={cn(
        "flex h-[calc(100dvh-250px)] gap-4 overflow-hidden bg-background p-4",
        isMobile ? "flex-col" : "flex-row",
      )}
    >
      {/* Left Column - Queue and Team */}
      <div
        className={cn(
          "flex flex-col gap-4",
          isMobile ? "h-[40vh] w-full" : "h-full w-[320px] min-w-[320px]",
        )}
      >
        {/* Task Queue Card */}
        <Card className="flex flex-col overflow-hidden border-border bg-card shadow-lg transition-all hover:shadow-xl">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/20 p-2">
                  <Inbox className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-card-foreground">
                    Fila de {assignment?.name || "Carregando..."}
                  </CardTitle>
                </div>
              </div>
              <Badge variant="guest" className="px-2 py-1 font-medium">
                {loadingAvailable ? "..." : availableTasks?.length || 0}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex items-center justify-between p-4 pt-3">
            <Button
              variant="default"
              size={isMobile ? "sm" : "default"}
              onClick={handleTakeTask}
              disabled={
                loadingAvailable ||
                availableTasks.length === 0 ||
                inProgressTasks?.length > 0
              }
              className="gap-1 bg-primary text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg"
            >
              {loadingAvailable ? (
                <span className="flex items-center gap-1">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processando...</span>
                </span>
              ) : inProgressTasks?.length > 0 ? (
                <span className="flex items-center gap-1">
                  <span>Finalize a demanda atual</span>
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <span>Tratar</span>
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Team Card */}
        <Card className="flex-1 overflow-hidden border-border bg-gradient-to-br from-card to-card/80 shadow-lg transition-all hover:shadow-xl">
          <CardHeader className="p-4 pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/20 p-2">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-card-foreground">
                    Meu Time
                  </CardTitle>
                </div>
              </div>
              <Badge variant="guest" className="px-2 py-1 font-medium">
                {teamMembers.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="h-full p-0">
            <ScrollArea className="h-full">
              <div className="space-y-2 p-3">
                {usersLoading ? (
                  <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Carregando usuários...
                  </div>
                ) : usersError ? (
                  <div className="rounded-md bg-destructive/10 p-3 text-center text-sm text-destructive">
                    Erro ao carregar usuários
                  </div>
                ) : teamMembers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-2 py-6 text-center text-sm text-muted-foreground">
                    <Users className="h-8 w-8 opacity-40" />
                    Nenhum membro na equipe
                  </div>
                ) : (
                  teamMembers.map((user) => (
                    <div
                      key={user._id}
                      className="group flex items-center gap-3 rounded-lg p-3 transition-all hover:bg-primary/5 hover:shadow-sm"
                    >
                      <Avatar className="h-10 w-10 border-2 border-background shadow transition-all group-hover:border-primary/30 group-hover:shadow-md">
                        <AvatarImage
                          src={user.avatar || "/placeholder.svg"}
                          alt={user.NOME}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {user.NOME.split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-1 flex-col overflow-hidden">
                        <span className="truncate text-sm font-medium text-card-foreground">
                          {formatUserName(user.NOME)}
                        </span>
                      </div>
                      {inProgressTasks.some(
                        (t) => t.assignedTo === user._id,
                      ) && (
                        <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Right Columns - In Progress and Completed */}
      <div
        className={cn(
          "flex flex-1 gap-4 overflow-hidden",
          isMobile ? "h-[60vh] flex-col" : "h-full flex-row",
        )}
      >
        {/* In Progress Column */}
        <div className="flex flex-1 flex-col gap-4 overflow-hidden">
          <Card className="bg-gradient-to-br from-card to-card/80 shadow-lg">
            <CardHeader className="rounded-md p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-warning/10 p-2">
                  <Clock className="h-5 w-5 text-warning" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg font-semibold text-card-foreground">
                      Em Tratamento
                    </CardTitle>
                  </div>
                  <CardDescription className="text-xs text-muted-foreground"></CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="flex-1 overflow-hidden border-border bg-gradient-to-br from-card to-card/80 shadow-lg">
            <ScrollArea className="h-full">
              <CardContent className="min-h-[200px] space-y-4 p-4">
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
                  <div className="flex h-full min-h-[100px] flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>Carregando tarefas...</span>
                  </div>
                ) : (
                  <div className="flex h-full min-h-[50vh] flex-col items-center justify-center gap-3 text-center">
                    <div className="rounded-full bg-warning/10 p-4">
                      <Clock className="h-8 w-8 text-warning/70" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-muted-foreground">
                        Nenhuma demanda em tratamento
                      </div>
                      <div className="text-xs text-muted-foreground/70">
                        Clique em "Tratar" para iniciar
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </ScrollArea>
          </Card>
        </div>

        {/* Completed Column */}
        <div className="flex flex-1 flex-col gap-4 overflow-hidden">
          <Card className="bg-gradient-to-br from-card to-card/80 shadow-lg">
            <CardHeader className="rounded-md p-4">
              <div className="flex w-full flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-success/10 p-2">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg font-semibold text-card-foreground">
                        Finalizadas
                      </CardTitle>
                      <Badge variant="guest" className="px-2 py-1 font-medium">
                        {filteredCompletedTasks?.length || 0}
                      </Badge>
                    </div>
                  </div>
                </div>
                <FinishedTaskFilter
                  tasks={completedTasks}
                  isMobile={isMobile}
                  onFilter={setFilteredCompletedTasks}
                />
              </div>
            </CardHeader>
          </Card>

          <Card className="flex-1 overflow-hidden border-border bg-gradient-to-br from-card to-card/80 shadow-lg">
            <ScrollArea className="h-full">
              <CardContent className="min-h-[200px] space-y-4 p-4">
                {filteredCompletedTasks?.length > 0 ? (
                  filteredCompletedTasks.map((task) => (
                    <TaskCard key={task._id} task={task} isCompleted />
                  ))
                ) : loadingCompleted ? (
                  <div className="flex h-full min-h-[100px] flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>Carregando tarefas finalizadas...</span>
                  </div>
                ) : (
                  <div className="flex h-full min-h-[50vh] flex-col items-center justify-center gap-3 text-center">
                    <div className="rounded-full bg-success/10 p-4">
                      <CheckCircle2 className="h-8 w-8 text-success/70" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-muted-foreground">
                        Nenhuma demanda finalizada
                      </div>
                      <div className="text-xs text-muted-foreground/70">
                        Tarefas concluídas aparecerão aqui
                      </div>
                    </div>
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
