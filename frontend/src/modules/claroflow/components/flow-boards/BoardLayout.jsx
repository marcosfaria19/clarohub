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

export default function GenericBoard({ assignmentId, projectId }) {
  const { getUsersByProjectAndAssignment, loading, error } = useUsers();
  const teamMembers = getUsersByProjectAndAssignment(projectId, assignmentId);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Altura principal calculada
  const mainHeight = `calc(100dvh - 250px)`;

  return (
    <div
      className={cn(
        "flex h-full gap-4 overflow-hidden bg-background p-4",
        isMobile ? "flex-col" : "flex-row",
      )}
      style={{ height: mainHeight }}
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
              Fila de{" "}
              {teamMembers[0]?.assignments?.find((a) => a._id === assignmentId)
                ?.name || "Carregando..."}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between p-4 pt-0">
            <span className="text-2xl font-medium text-card-foreground">
              24
            </span>
            <Button variant="default" size={isMobile ? "sm" : "default"}>
              Tratar →
            </Button>
          </CardContent>
        </Card>

        <Card className="flex-1 overflow-hidden border-border bg-card">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-card-foreground">
                Meu Time
              </CardTitle>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{teamMembers.length}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-full p-4 pt-0">
            <ScrollArea className="h-full">
              <div className="space-y-2 pr-2">
                {loading ? (
                  <div className="text-muted-foreground">Carregando...</div>
                ) : error ? (
                  <div className="text-destructive">
                    Erro ao carregar usuários
                  </div>
                ) : (
                  teamMembers.map((user) => (
                    <Card
                      key={user._id}
                      className="bg-background p-2 shadow-sm transition-colors hover:bg-accent/10"
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
