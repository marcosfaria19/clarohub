import React from "react";
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
import { useTasks } from "modules/claroflow/hooks/useTasks"; // ajuste o caminho conforme sua estrutura
import { TaskCard } from "./TaskCard"; // ajuste o caminho conforme sua estrutura

export default function GenericBoard({ assignment, project }) {
  const {
    getUsersByProjectAndAssignment,
    loading: usersLoading,
    error: usersError,
  } = useUsers();
  const teamMembers = getUsersByProjectAndAssignment(
    project._id,
    assignment._id,
  );

  // Utilize o hook useTasks passando o assignment._id
  const {
    tasks,
    loading: tasksLoading,
    error: tasksError,
  } = useTasks(assignment?._id);

  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div
      className={cn(
        "flex h-[calc(100dvh-250px)] gap-4 overflow-hidden bg-background p-4",
        isMobile ? "flex-col" : "flex-row",
      )}
    >
      {/* Coluna Esquerda */}
      <div
        className={cn(
          "flex flex-col gap-4",
          isMobile ? "h-[40vh] w-full" : "h-full w-[300px]",
        )}
      >
        <Card className="flex flex-col border-border bg-card">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-lg font-semibold text-card-foreground">
              Fila de {assignment?.name || "Carregando..."}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between p-4 pt-0">
            <span className="text-2xl font-medium text-card-foreground">
              {/* Aqui, você poderá futuramente calcular a contagem real */}
              {tasks ? tasks.length : 0}
            </span>
            <Button variant="default" size={isMobile ? "sm" : "default"}>
              Tratar →
            </Button>
          </CardContent>
        </Card>

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

      {/* Colunas Direitas */}
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
                Em Tratamento
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="flex-1 overflow-hidden border-border bg-card">
            <ScrollArea className="h-full">
              <CardContent className="space-y-4 p-4">
                {tasksLoading ? (
                  <div className="text-muted-foreground">
                    Carregando demandas...
                  </div>
                ) : tasksError ? (
                  <div className="text-destructive">
                    Erro ao carregar demandas
                  </div>
                ) : tasks.length > 0 ? (
                  tasks.map((task) => <TaskCard key={task._id} task={task} />)
                ) : (
                  <div className="text-muted-foreground">
                    Nenhuma demanda encontrada.
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
                  Finalizadas
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
                {/* Aqui você poderá implementar a renderização das tasks finalizadas */}
                {[...Array(10)].map((_, i) => (
                  <Card
                    key={i}
                    className="h-28 rounded-lg border-border bg-background shadow-sm"
                  />
                ))}
              </CardContent>
            </ScrollArea>
          </Card>
        </div>
      </div>
    </div>
  );
}
