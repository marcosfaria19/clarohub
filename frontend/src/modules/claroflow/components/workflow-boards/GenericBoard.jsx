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

export default function GenericBoard({ assignmentId, projectId }) {
  const { getUsersByProjectAndAssignment, loading, error } = useUsers();
  const teamMembers = getUsersByProjectAndAssignment(projectId, assignmentId);

  return (
    <div className="flex h-full flex-col gap-4 p-4 md:flex-row">
      {/* Primeira Coluna */}
      <div className="flex w-full flex-col gap-4 md:w-[300px]">
        {/* Card Fila */}
        <Card className="flex h-48 flex-col justify-between border-border bg-card-spark text-card-foreground">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">
              Fila de GENERIC
              {teamMembers[0]?.assignments?.find((a) => a._id === assignmentId)
                ?.name || "Carregando..."}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col justify-between">
            <div className="flex-1 text-sm text-muted-foreground">
              Pendentes: <span className="text-primary">24</span>
            </div>
            <div className="flex justify-end">
              <Button variant="primary" size="sm">
                Tratar →
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Card Meu Time */}
        <Card className="h-full border-border bg-card-spark text-card-foreground">
          <CardHeader className="pb-2">
            <CardTitle className="mb-4 text-lg">Meu Time</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <div>Carregando...</div>
            ) : error ? (
              <div>Erro ao carregar usuários</div>
            ) : (
              <div className="flex flex-col gap-3">
                {/* Lista de membros com avatares e nomes */}
                {teamMembers.slice(0, 5).map((user) => (
                  <div key={user._id} className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 border-2 border-background">
                      <AvatarImage src={user.avatar} alt={user.NOME} />
                      <AvatarFallback>
                        {user.NOME.split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{formatUserName(user.NOME)}</span>
                  </div>
                ))}

                {/* Indicador de overflow */}
                {teamMembers.length > 5 && (
                  <div className="flex items-center gap-3">
                    <div className="text-md flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-[#edd0af] font-medium text-board-title">
                      +{teamMembers.length - 5}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {teamMembers.length - 5} membros adicionais
                    </span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Segunda Coluna - Em Tratamento */}
      <Card className="flex-1 border-border bg-card-spark text-card-foreground">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Em Tratamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[550px] rounded-lg border-2 border-dashed border-border p-4 text-center text-muted-foreground">
            Área para listagem de itens em tratamento
          </div>
        </CardContent>
      </Card>

      {/* Terceira Coluna - Finalizadas */}
      <Card className="flex-1 border-border bg-card-spark text-card-foreground">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Finalizadas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Input
              placeholder="Buscar finalizadas..."
              className="bg-card pl-4 pr-10"
            />
            <SearchIcon className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
          </div>
          <div className="h-[500px] rounded-lg border-2 border-dashed border-border p-4 text-center text-muted-foreground">
            Área para listagem de itens finalizados
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
