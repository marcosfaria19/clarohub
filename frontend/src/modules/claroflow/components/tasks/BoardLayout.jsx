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
import { ScrollArea } from "modules/shared/components/ui/scroll-area";
import {
  Users,
  Inbox,
  Clock,
  CheckCircle2,
  ArrowRight,
  Loader2,
  FileText,
  Calendar as CalendarIcon,
} from "lucide-react";
import { formatUserName } from "modules/shared/utils/formatUsername";
import { useUsers } from "modules/claroflow/hooks/useUsers";
import { useMediaQuery } from "modules/shared/hooks/use-media-query";
import { cn } from "modules/shared/lib/utils";

import { TaskCard } from "./TaskCard";
import { AuthContext } from "modules/shared/contexts/AuthContext";
import { useTasks } from "modules/claroflow/hooks/useTasks";
import FinishedTaskFilter from "./FinishedTaskFilter";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "modules/shared/components/ui/tooltip";

export default function GenericBoard({
  assignment,
  project,
  flowType = "default", // 'default' ou 'shared'
}) {
  const { user } = useContext(AuthContext);
  const userId = user.userId;
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Hook para users por demanda
  const {
    users: teamMembers,
    loading: usersLoading,
    error: usersError,
  } = useUsers(assignment._id);

  // Hook para tasks
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
  } = useTasks({
    assignmentId: assignment._id,
    userId,
    flowType,
  });

  const handleTakeTask = async () => {
    try {
      await takeTask(assignment._id);
      await Promise.all([refetchAvailableTasks(), refetchInProgressTasks()]);
    } catch (err) {
      console.error("Falha ao assumir tarefa:", err);
    }
  };

  // Estado para o toggle de filtro por data (padrão: true = só hoje)
  const [showOnlyToday, setShowOnlyToday] = useState(true);

  // Lista filtrada por data antes do search
  const [dateFilteredTasks, setDateFilteredTasks] = useState([]);
  const [filteredCompletedTasks, setFilteredCompletedTasks] = useState([]);

  useEffect(() => {
    if (!completedTasks || loadingCompleted) {
      setDateFilteredTasks([]);
      return;
    }

    let tasksToFilter = completedTasks;

    if (showOnlyToday) {
      const today = new Date().toISOString().split("T")[0];
      tasksToFilter = completedTasks.filter((task) => {
        if (!task.finishedAtByUser) return false;
        const finishedDate = new Date(task.finishedAtByUser)
          .toISOString()
          .split("T")[0];
        return finishedDate === today;
      });
    }

    setDateFilteredTasks(tasksToFilter);
    setFilteredCompletedTasks(tasksToFilter);
  }, [completedTasks, showOnlyToday, loadingCompleted]);

  // Título dinâmico
  const titleText = showOnlyToday ? "Finalizadas hoje" : "Todas finalizadas";
  const descriptionText = showOnlyToday
    ? flowType === "shared"
      ? "Demandas concluídas hoje pelo time"
      : "Demandas concluídas hoje por você"
    : flowType === "shared"
      ? "Todas as demandas concluídas pelo time"
      : "Todas as demandas concluídas por você";

  return (
    <div className="rounded-xl bg-gradient-to-b from-background to-background/95 p-4">
      {/* Header com título do projeto */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 brightness-[1.6]">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {assignment?.name || "Carregando..."}
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                {project?.name && `• ${project.name}`}
              </span>
            </h2>
          </div>
        </div>
      </div>

      {/* Container principal - adapta para mobile/desktop */}
      <div
        className={cn(
          "flex h-[calc(100dvh-310px)] gap-5 overflow-hidden",
          isMobile ? "flex-col" : "flex-row",
        )}
      >
        {/* Coluna Esquerda - Fila e Time (apenas para fluxo padrão) */}
        {flowType === "default" && (
          <div
            className={cn(
              "flex flex-col gap-5",
              isMobile ? "h-[40vh] w-full" : "h-full w-[320px] min-w-[320px]",
            )}
          >
            {/* Card de Fila de Tarefas */}
            <Card className="overflow-hidden border-border bg-card/95 shadow-md transition-all hover:shadow-lg">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2 brightness-[1.6]">
                      <Inbox className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-card-foreground">
                        Fila de Demandas
                        <span className="px-2 py-1 text-base font-semibold text-accent brightness-[1.6]">
                          (
                          {loadingAvailable ? (
                            <Loader2 className="mr-1 inline h-3 w-3 animate-spin" />
                          ) : (
                            availableTasks?.length || 0
                          )}
                          )
                        </span>
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Disponíveis para tratamento
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <Button
                  variant="default"
                  size={isMobile ? "sm" : "default"}
                  onClick={handleTakeTask}
                  disabled={
                    loadingAvailable ||
                    availableTasks.length === 0 ||
                    inProgressTasks?.length > 0
                  }
                  className="w-full gap-1 bg-primary text-primary-foreground shadow transition-all hover:bg-primary/90 hover:shadow-md"
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
                      <span>Tratar Próxima Demanda</span>
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Card de Time */}
            <Card className="flex-1 overflow-hidden border-border bg-card/95 shadow-md transition-all hover:shadow-lg">
              <CardHeader className="p-4 pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2 brightness-[1.6]">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-card-foreground">
                        Meu Time
                        <span className="px-2 py-1 text-base font-semibold text-accent brightness-[1.6]">
                          ({teamMembers?.length || 0})
                        </span>
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Membros ativos no projeto
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="h-full p-0">
                <ScrollArea className="h-full">
                  <div className="space-y-1 p-3">
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
                          className={cn(
                            "group flex items-center gap-3 rounded-lg p-2.5 transition-all",
                            inProgressTasks.some(
                              (t) => t.assignedTo === user._id,
                            )
                              ? "bg-primary/5 shadow-sm"
                              : "hover:bg-primary/5 hover:shadow-sm",
                          )}
                        >
                          <Avatar
                            className={cn(
                              "h-9 w-9 border-2 shadow transition-all",
                              inProgressTasks.some(
                                (t) => t.assignedTo === user._id,
                              )
                                ? "border-primary/30 shadow-md"
                                : "border-background group-hover:border-primary/30 group-hover:shadow-md",
                            )}
                          >
                            <AvatarImage
                              src={user.avatar || "/placeholder.svg"}
                              alt={user.NOME}
                            />
                            <AvatarFallback className="bg-primary/10 text-primary brightness-[1.6]">
                              {user.NOME.split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-1 flex-col overflow-hidden">
                            <span className="truncate text-sm font-medium text-card-foreground">
                              {formatUserName(user.NOME)}
                            </span>
                            {inProgressTasks.some(
                              (t) => t.assignedTo === user._id,
                            ) && (
                              <span className="text-xs text-primary">
                                Trabalhando em uma demanda
                              </span>
                            )}
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
        )}

        {/* Colunas da Direita - Em Progresso e Concluídas */}
        <div
          className={cn(
            "flex gap-5 overflow-hidden",
            flowType === "default" ? "flex-1" : "w-full flex-1", // Ajuste para ocupar todo espaço no fluxo compartilhado
            isMobile ? "h-[60vh] flex-col" : "h-full flex-row",
          )}
        >
          {/* Coluna Em Progresso */}
          <div
            className={cn(
              "flex flex-col gap-5 overflow-hidden",
              flowType === "shared" ? "flex-1" : "flex-1",
            )}
          >
            <Card className="overflow-hidden border-border bg-card/95 shadow-md">
              <CardHeader className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-warning/10 p-2 brightness-[0.8]">
                    <Clock className="h-5 w-5 text-warning" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg font-semibold text-card-foreground">
                        Em Tratamento
                      </CardTitle>
                    </div>
                    <CardDescription className="text-xs">
                      {flowType === "shared"
                        ? "Demandas sendo tratadas pelo time"
                        : "Demandas que você está tratando atualmente"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="flex-1 overflow-hidden border-border bg-card/95 shadow-md">
              <ScrollArea className="h-full">
                <CardContent
                  className={cn(
                    "min-h-[200px] space-y-4 p-4",
                    isMobile ? "min-h-[30vh]" : "min-h-[40vh]",
                  )}
                >
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
                        // Permitir edição para todos no fluxo compartilhado
                        editable={flowType === "shared"}
                      />
                    ))
                  ) : loadingInProgress ? (
                    <div className="flex h-full min-h-[100px] flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span>Carregando tarefas...</span>
                    </div>
                  ) : (
                    <div
                      className={cn(
                        "flex flex-col items-center justify-center gap-3 text-center",
                        isMobile ? "h-[30vh]" : "h-[40vh]",
                      )}
                    >
                      <div className="rounded-full bg-warning/10 p-4">
                        <Clock className="h-8 w-8 text-warning/70" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-foreground">
                          Nenhuma demanda em tratamento
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {flowType === "shared"
                            ? "As demandas em tratamento aparecerão aqui"
                            : 'Clique em "Tratar Próxima Demanda" para iniciar'}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </ScrollArea>
            </Card>
          </div>

          {/* Coluna Concluídas */}
          <div
            className={cn(
              "flex flex-col gap-5 overflow-hidden",
              flowType === "shared" ? "flex-1" : "flex-1",
            )}
          >
            <Card className="overflow-hidden border-border bg-card/95 shadow-md">
              <CardHeader className={cn("p-4", isMobile && "pb-2")}>
                <div
                  className={cn(
                    "flex items-center justify-between gap-3",
                    isMobile ? "flex-col items-start" : "flex-row items-center",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-success/10 p-2 brightness-[0.9]">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg font-semibold text-card-foreground">
                          {titleText}
                        </CardTitle>
                        <span className="px-0 py-1 text-base font-semibold text-green-500">
                          ({filteredCompletedTasks?.length || 0})
                        </span>
                      </div>
                      <CardDescription className="text-xs">
                        {descriptionText}
                      </CardDescription>
                    </div>
                  </div>
                  <div
                    className={cn(
                      isMobile && "ml-11 mt-1 w-full",
                      "flex items-center gap-2",
                    )}
                  >
                    <FinishedTaskFilter
                      tasks={dateFilteredTasks}
                      isMobile={isMobile}
                      onFilter={setFilteredCompletedTasks}
                      mode={showOnlyToday ? "today" : "all"}
                    />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowOnlyToday(!showOnlyToday)}
                            className={cn(
                              "p-1",
                              showOnlyToday
                                ? "text-primary"
                                : "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p>
                            {showOnlyToday
                              ? "Mostrar todas as finalizadas"
                              : "Mostrar só as de hoje"}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="flex-1 overflow-hidden border-border bg-card/95 shadow-md">
              <ScrollArea className="h-full">
                <CardContent
                  className={cn(
                    "min-h-[200px] space-y-4 p-4",
                    isMobile ? "min-h-[30vh]" : "min-h-[40vh]",
                  )}
                >
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
                    <div
                      className={cn(
                        "flex flex-col items-center justify-center gap-3 text-center",
                        isMobile ? "h-[30vh]" : "h-[40vh]",
                      )}
                    >
                      <div className="rounded-full bg-success/10 p-4">
                        <CheckCircle2 className="h-8 w-8 text-success/70" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-foreground">
                          Nenhuma demanda finalizada
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {flowType === "shared"
                            ? "Demandas concluídas pelo time aparecerão aqui"
                            : "Demandas concluídas por você aparecerão aqui"}
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
    </div>
  );
}
