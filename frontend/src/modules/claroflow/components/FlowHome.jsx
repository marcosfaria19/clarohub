import React from "react";
import { useUsers } from "../hooks/useUsers";
import bg from "../assets/bg-curves.png";
import { Avatar, AvatarImage } from "modules/shared/components/ui/avatar";
import { useTheme } from "modules/shared/contexts/ThemeContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "modules/shared/components/ui/tooltip";
import { formatUserName } from "modules/shared/utils/formatUsername";

export function FlowHome({ project }) {
  const { getUsersByProjectId, loading, error } = useUsers();
  const projectUsers = project ? getUsersByProjectId(project._id) : [];

  const { theme } = useTheme();

  return (
    <div className="relative flex min-h-[75vh] w-full flex-col justify-center bg-card bg-cover bg-center">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${bg})`,
          opacity: `${theme === "light" ? 1 : 0.05}`,
        }}
      />

      {/* Header com gestor e avatares - posicionado de forma absoluta */}
      <div className="absolute right-6 top-6 flex flex-col items-end">
        <span className="text-md mb-2 font-medium text-muted-foreground">
          Equipe: {project?.name}
        </span>
        <div className="flex -space-x-2">
          {loading ? (
            <div>Carregando...</div>
          ) : error ? (
            <div>Erro ao carregar usuários</div>
          ) : (
            <>
              {[...projectUsers]
                .sort(() => Math.random() - 0.5)
                .slice(0, 5)
                .map((user) => (
                  <TooltipProvider key={user._id}>
                    <Tooltip>
                      <TooltipTrigger>
                        <Avatar className="h-12 w-12 border-2 border-background">
                          <AvatarImage
                            src={user.avatar || "/placeholder-avatar.png"}
                            alt={user.NOME}
                          />
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent>
                        {formatUserName(user.NOME)}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}

              {projectUsers.length > 5 && (
                <div className="text-md flex h-12 w-12 items-center justify-center rounded-full border-2 border-background bg-[#edd0af] font-medium text-board-title">
                  +{projectUsers.length - 5}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Conteúdo da página centralizado */}
      <div className="relative flex flex-col items-center justify-center px-4 text-center">
        <div className="absolute z-50 h-60 w-60 animate-pulse rounded-full bg-primary/40 blur-3xl"></div>

        <img
          src="icons/flow.png"
          alt="Claro Flow"
          className="relative mb-2 h-32 w-32 text-primary sm:h-40 sm:w-40"
        />
        <h1 className="relative text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
          Flow
        </h1>
        <p className="relative mt-2 text-base text-muted-foreground sm:text-lg md:text-xl">
          Acompanhamento de demandas da equipe de Engenharia
        </p>
      </div>
    </div>
  );
}
