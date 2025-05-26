import axiosInstance from "services/axios";

//////////////////////////////////////////////////////////////////////////////////////////////////////
// Função para buscar dados do dashboard
export const fetchDashboardData = async (
  period = "week",
  teamMember = null,
) => {
  try {
    const params = { period, teamMember };
    const response = await axiosInstance.get("/insights/dashboard", { params });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar dados do dashboard:", error);
    throw error;
  }
};

// Função para buscar dados de desempenho da equipe
export const fetchTeamPerformance2 = async (period = "week") => {
  try {
    const response = await axiosInstance.get("/dashboard/team-performance", {
      params: { period },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar dados de desempenho da equipe:", error);
    throw error;
  }
};

// Função para buscar dados do heatmap
export const fetchHeatmapData = async () => {
  try {
    const response = await axiosInstance.get("/dashboard/heatmap");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar dados do heatmap:", error);
    throw error;
  }
};

// Função para buscar dados do radar chart
export const fetchRadarData = async (teamMember = null) => {
  try {
    const params = teamMember ? { teamMember } : {};
    const response = await axiosInstance.get("/dashboard/radar", { params });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar dados do radar chart:", error);
    throw error;
  }
};

// Função para buscar dados da tabela de demandas
export const fetchDemandItems = async (status, sortBy, sortDirection) => {
  try {
    const params = { status, sortBy, sortDirection };
    const response = await axiosInstance.get("/dashboard/demands", { params });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar dados das demandas:", error);
    throw error;
  }
};

// Função para buscar resumo de status das demandas
export const fetchDemandStatusSummary = async () => {
  try {
    const response = await axiosInstance.get("/dashboard/demand-status");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar resumo de status das demandas:", error);
    throw error;
  }
};

// Função para atualizar status de uma demanda
export const updateDemandStatus = async (demandId, status, progresso) => {
  try {
    await axiosInstance.patch(`/dashboard/demands/${demandId}`, {
      status,
      progresso,
    });
  } catch (error) {
    console.error("Erro ao atualizar status da demanda:", error);
    throw error;
  }
};

// Função para criar uma nova demanda
export const createDemand = async (demandData) => {
  try {
    const response = await axiosInstance.post("/dashboard/demands", demandData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar nova demanda:", error);
    throw error;
  }
};
