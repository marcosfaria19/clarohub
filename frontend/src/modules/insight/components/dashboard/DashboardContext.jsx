import React, { createContext, useContext, useState, useCallback } from "react";
import { fetchDashboardData } from "./api";

// Criando o contexto com valor inicial
const DashboardContext = createContext({
  period: "week",
  setPeriod: () => {},
  teamMember: null,
  setTeamMember: () => {},
  isLoading: false,
  error: null,
  refreshData: async () => {},
});

export const DashboardProvider = ({ children }) => {
  // Estados do contexto
  const [period, setPeriod] = useState("day");
  const [teamMember, setTeamMember] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Função para atualizar os dados do dashboard
  const refreshData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Chamada para a API para buscar os dados atualizados
      await fetchDashboardData(period, teamMember);
      // Aqui você poderia atualizar outros estados com os dados recebidos
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar dados");
      console.error("Erro ao atualizar dados do dashboard:", err);
    } finally {
      setIsLoading(false);
    }
  }, [period, teamMember]);

  // Valor do contexto que será fornecido aos componentes
  const contextValue = {
    period,
    setPeriod,
    teamMember,
    setTeamMember,
    isLoading,
    error,
    refreshData,
  };

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
};

// Hook personalizado para usar o contexto
export const useDashboard = () => {
  const context = useContext(DashboardContext);

  if (!context) {
    throw new Error(
      "useDashboard deve ser usado dentro de um DashboardProvider",
    );
  }

  return context;
};

export default DashboardContext;
