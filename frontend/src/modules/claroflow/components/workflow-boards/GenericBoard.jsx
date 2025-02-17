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
import { SearchIcon } from "lucide-react";

import { formatUserName } from "modules/shared/utils/formatUsername";
import { useUsers } from "modules/claroflow/hooks/useUsers";
import { ScrollArea } from "modules/shared/components/ui/scroll-area";

export default function GenericBoard({ assignmentId, projectId }) {
  const { getUsersByProjectAndAssignment, loading, error } = useUsers();
  const teamMembers = getUsersByProjectAndAssignment(projectId, assignmentId);

  return (
    <div className="mx-6 flex h-full flex-col gap-12 pt-6 drop-shadow-[0_3px_3px_rgba(0,0,0,0.7)] md:flex-row md:flex-wrap">
      {/* Primeira Coluna */}
      <div className="flex w-full flex-col gap-8 md:w-[300px]">
        {/* Card Fila */}
        <Card className="flex flex-col justify-between border-none bg-secondary text-card-foreground">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-lg">
              Fila de{" "}
              {teamMembers[0]?.assignments?.find((a) => a._id === assignmentId)
                ?.name || "Carregando..."}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between text-3xl">
            <span className="text-card-foreground">24</span>
            <Button variant="primary" size="sm">
              Tratar →
            </Button>
          </CardContent>
        </Card>

        {/* Card Meu Time */}
        <Card className="h-full border-none bg-secondary text-card-foreground">
          <CardHeader className="pb-2">
            <CardTitle className="mb-4 text-lg">Meu Time</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <div>Carregando...</div>
            ) : error ? (
              <div>Erro ao carregar usuários</div>
            ) : (
              <div className="flex flex-col gap-3 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
                {teamMembers.slice(0, 5).map((user) => (
                  <Card
                    key={user._id}
                    className="flex items-center gap-3 border-none p-2 shadow-md"
                  >
                    <Avatar className="h-8 w-8 border-2 border-background">
                      <AvatarImage src={user.avatar} alt={user.NOME} />
                      <AvatarFallback>
                        {user.NOME.split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{formatUserName(user.NOME)}</span>
                  </Card>
                ))}

                {teamMembers.length > 5 && (
                  <Card className="flex items-center gap-3 p-2 shadow-md">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-[#edd0af] font-medium text-board-title">
                      +{teamMembers.length - 5}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {teamMembers.length - 5} membros adicionais
                    </span>
                  </Card>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Second Column - Em Tratamento */}
      <div className="flex min-w-0 flex-1 flex-col space-y-4">
        <Card className="rounded-lg border-none bg-secondary text-card-foreground">
          <CardHeader className="h-12 p-3">
            <CardTitle className="text-lg">Em Tratamento</CardTitle>
          </CardHeader>
        </Card>

        <Card className="flex-1 border-none bg-secondary text-card-foreground">
          <CardContent className="h-full p-4">
            <div className="h-full space-y-4 rounded-lg p-2 text-center text-muted-foreground drop-shadow-[0_3px_3px_rgba(0,0,0,0.7)]">
              {[...Array(4)].map((_, i) => (
                <Card
                  key={i}
                  className="min-h-28 rounded-lg border-none bg-card"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Third Column - Finalizadas */}
      <div className="flex min-w-0 flex-1 flex-col space-y-4">
        <Card className="border-none bg-secondary text-card-foreground">
          <CardHeader className="h-12 p-3">
            <CardTitle className="flex h-8 items-start justify-between text-lg">
              Finalizadas
              <div className="relative bottom-[7px] w-3/5">
                <Input
                  placeholder="Buscar finalizadas..."
                  className="w-full border-none bg-card pl-4 pr-10"
                />
                <SearchIcon className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              </div>
            </CardTitle>
          </CardHeader>
        </Card>
        <ScrollArea className="max-h-[550px]">
          <Card className="flex-1 border-none bg-secondary text-card-foreground">
            <CardContent className="h-full p-4">
              <div className="h-full space-y-4 rounded-lg p-2 text-center text-muted-foreground drop-shadow-[0_3px_3px_rgba(0,0,0,0.7)]">
                {[...Array(5)].map((_, i) => (
                  <Card
                    key={i}
                    className="min-h-28 rounded-lg border-none bg-card"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </ScrollArea>
      </div>
    </div>
  );
}
