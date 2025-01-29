import React from "react";
import { useUsers } from "../hooks/useUsers";
import bg from "../assets/bg-curves.png";
import { Avatar, AvatarImage } from "modules/shared/components/ui/avatar";
import { formatUserName } from "modules/shared/utils/formatUsername";

export function FlowHome({ projectId, gestor }) {
  const { getUsersByProjectId, loading, error } = useUsers();
  const projectUsers = getUsersByProjectId(projectId);

  return (
    <div className="relative flex min-h-[75vh] w-full flex-col justify-between rounded-lg rounded-tr-none bg-board bg-cover bg-center">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${bg})`,
          opacity: 0.05,
        }}
      />

      {/* Header with team manager and avatars */}
      <div className="relative z-10 m-6 flex flex-col items-end">
        <span className="text-md mb-2 font-medium text-muted-foreground">
          Equipe: {formatUserName(gestor)}
        </span>
        <div className="flex -space-x-2">
          {loading ? (
            <div>Carregando...</div>
          ) : error ? (
            <div>Erro ao carregar usuários</div>
          ) : (
            <>
              {projectUsers.slice(0, 5).map((user) => (
                <Avatar
                  key={user._id}
                  className="h-12 w-12 border-2 border-background"
                >
                  <AvatarImage src={user.avatar} alt={user.NOME} />
                </Avatar>
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

      {/* Page content */}
      <div className="relative flex flex-1 flex-col items-center justify-center">
        <div className="absolute z-50 h-60 w-60 animate-pulse rounded-full bg-primary/40 blur-3xl"></div>

        <img
          src="icons/flow.png"
          alt="Net Fácil Icon"
          className="relative z-10 mb-2 h-40 w-40 text-primary"
        />
        <h1 className="text-5xl font-bold tracking-tight text-foreground">
          Flow
        </h1>
        <p className="mt-2 text-xl text-muted-foreground">
          Acompanhamento de demandas da equipe de Engenharia
        </p>
      </div>

      {/* Bottom buttons */}
      <div className="relative z-10 p-4">
        <div className="flex gap-4">
          <button className="rounded-lg bg-gray-800 px-6 py-3 font-medium text-white hover:bg-gray-700">
            Gestão TAP
          </button>
          <button className="rounded-lg bg-gray-800 px-6 py-3 font-medium text-white hover:bg-gray-700">
            Gestão NAP
          </button>
        </div>
      </div>
    </div>
  );
}
