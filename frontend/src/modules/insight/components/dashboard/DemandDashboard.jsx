import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useDashboard } from "./DashboardContext";
import KPICard from "./KPICard";
import TeamPerformanceChart from "./TeamPerformanceChart";
import TeamHeatmap from "./TeamHeatmap";
import PerformanceRadarChart from "./PerformanceRadarChart";
import DemandStatusTable from "./DemandStatusTable";

// Importando dados mockados
import {
  queueTimeData,
  volumeData,
  teamPerformanceData,
  teamHeatmapData,
  radarData,
  demandStatusData,
  teamMembers,
} from "./mockData";

const DemandDashboard = () => {
  const {
    period,
    setPeriod,
    teamMember,
    setTeamMember,
    isLoading,
    error,
    refreshData,
  } = useDashboard();

  // Estado para controlar a exibição do seletor de colaborador
  const [showTeamSelector, setShowTeamSelector] = useState(false);

  // Efeito para carregar dados iniciais
  useEffect(() => {
    refreshData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Função para alternar o período
  const handlePeriodChange = useCallback(
    (newPeriod) => {
      setPeriod(newPeriod);
      refreshData();
    },
    [setPeriod, refreshData],
  );

  // Função para selecionar um colaborador
  const handleTeamMemberSelect = useCallback(
    (member) => {
      setTeamMember(member);
      setShowTeamSelector(false);
      refreshData();
    },
    [setTeamMember, refreshData],
  );

  // Renderizar mensagem de erro
  if (error) {
    return (
      <div className="rounded-lg bg-card p-6 shadow-md">
        <div className="mb-4 flex items-center text-destructive">
          <svg
            className="mr-2 h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-medium">Erro ao carregar dados</h3>
        </div>
        <p className="mb-4 text-muted-foreground">{error}</p>
        <button
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
          onClick={() => refreshData()}
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Cabeçalho do Dashboard */}
      <div className="mb-6 flex flex-col items-start justify-between md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Dashboard de Demanda/Equipe
          </h1>
          <p className="text-muted-foreground">
            Visão geral de desempenho e status das demandas
          </p>
        </div>

        <div className="mt-4 flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0 md:mt-0">
          {/* Seletor de período */}
          <div className="flex overflow-hidden rounded-md">
            <button
              className={`px-3 py-2 text-sm font-medium ${
                period === "day"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
              onClick={() => handlePeriodChange("day")}
            >
              Dia
            </button>
            <button
              className={`px-3 py-2 text-sm font-medium ${
                period === "week"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
              onClick={() => handlePeriodChange("week")}
            >
              Semana
            </button>
            <button
              className={`px-3 py-2 text-sm font-medium ${
                period === "month"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
              onClick={() => handlePeriodChange("month")}
            >
              Mês
            </button>
          </div>

          {/* Seletor de colaborador */}
          <div className="relative">
            <button
              className="flex items-center rounded-md bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground"
              onClick={() => setShowTeamSelector(!showTeamSelector)}
            >
              {teamMember || "Todos os colaboradores"}
              <svg
                className="ml-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showTeamSelector && (
              <motion.div
                className="absolute right-0 z-10 mt-2 w-56 rounded-md border border-border bg-popover shadow-lg"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <ul className="py-1">
                  <li>
                    <button
                      className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-secondary/50"
                      onClick={() => handleTeamMemberSelect(null)}
                    >
                      Todos os colaboradores
                    </button>
                  </li>
                  {teamMembers.map((member) => (
                    <li key={member.id}>
                      <button
                        className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-secondary/50"
                        onClick={() => handleTeamMemberSelect(member.nome)}
                      >
                        {member.nome}
                      </button>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>

          {/* Botão de atualização */}
          <button
            className="flex items-center rounded-md bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground"
            onClick={() => refreshData()}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg
                  className="-ml-1 mr-2 h-4 w-4 animate-spin text-foreground"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Atualizando...
              </>
            ) : (
              <>
                <svg
                  className="mr-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Atualizar
              </>
            )}
          </button>
        </div>
      </div>

      {/* Overlay de carregamento */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/50">
          <div className="flex items-center rounded-lg bg-card p-6 shadow-lg">
            <svg
              className="mr-3 h-6 w-6 animate-spin text-primary"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span className="text-foreground">Carregando dados...</span>
          </div>
        </div>
      )}

      {/* Cards de KPI */}
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <KPICard {...queueTimeData} />
        <KPICard {...volumeData} />
      </div>

      {/* Gráficos */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TeamPerformanceChart data={teamPerformanceData} />
        <TeamHeatmap data={teamHeatmapData} />
      </div>

      {/* Gráfico de Radar e Tabela */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PerformanceRadarChart
          data={radarData}
          colaborador={teamMember || "Colaborador"}
        />
        <DemandStatusTable data={demandStatusData} />
      </div>
    </div>
  );
};

export default React.memo(DemandDashboard);
