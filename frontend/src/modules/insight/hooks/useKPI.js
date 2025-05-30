import { useState, useEffect, useMemo, useCallback } from "react";
import axiosInstance from "services/axios";

// Funções de transformação de dados

// Converte milissegundos para horas com 1 casa decimal
const msToMinutes = (ms) => {
  return parseFloat((ms / (1000 * 60)).toFixed(1));
};

// Transforma dados de tempo médio para o formato de KPI Card
const transformAverageTimeToKPICard = (data, previousData) => {
  if (!data || data.length === 0) {
    return {
      title: "Tempo Médio de Tratativa",
      value: 0,
      unit: "minutos",
      trend: "neutral",
      trendValue: 0,
      previousValue: 0,
      icon: "clock",
    };
  }

  // Calcula a média de todos os usuários
  const totalAvgDuration =
    data.reduce((sum, item) => sum + item.avgDuration, 0) / data.length;
  const avgMinutes = msToMinutes(totalAvgDuration);

  // Calcula a média anterior se disponível
  let previousAvgMinutes = 0;
  if (previousData && previousData.length > 0) {
    const prevTotalAvgDuration =
      previousData.reduce((sum, item) => sum + item.avgDuration, 0) /
      previousData.length;
    previousAvgMinutes = msToMinutes(prevTotalAvgDuration);
  }

  return {
    title: "Tempo Médio de Tratativa",
    value: avgMinutes,
    unit: "minutos",
    previousValue: previousAvgMinutes,
    icon: "clock",
  };
};

// Transforma dados de volume para o formato de KPI Card
const transformVolumeToKPICard = (data, previousData, periodLabel) => {
  if (!data) {
    return {
      title: "Volume por Período",
      value: 0,
      unit: "demandas",
      trend: "neutral",
      trendValue: 0,
      previousValue: 0,
      period: periodLabel || "período",
      icon: "chart-bar",
    };
  }

  const currentCount = data.count || 0;
  const previousCount = previousData?.count || 0;

  const periodMap = {
    day: "dia",
    week: "semana",
    month: "mês",
  };

  return {
    title: "Volume por Período",
    value: currentCount,
    unit: "demandas",

    previousValue: previousCount,
    period: periodMap[data.period] || periodLabel || "período",
    icon: "chart-bar",
  };
};

// Transforma dados de performance da equipe para o formato do gráfico combinado
const transformTeamPerformanceToChart = (data) => {
  if (!data || data.length === 0) {
    return [];
  }

  // Mapeia os dados para o formato esperado pelo gráfico
  return data.map((item) => ({
    period: item.userName.split(" ")[0], // Usa o primeiro nome como período
    demandas: item.count,
    tempoMedio: msToMinutes(item.avgDuration),
  }));
};

// Transforma dados de performance da equipe para o formato do heatmap
const transformTeamPerformanceToHeatmap = (data) => {
  if (!data || data.length === 0) {
    return [];
  }

  // Cria o heatmap apenas com tempo médio e volume
  // (satisfação e qualidade não estão disponíveis na API)
  const result = [];

  data.forEach((item) => {
    // Adiciona métrica de tempo médio
    result.push({
      colaborador: item.userName,
      metrica: "Tempo Médio",
      valor: msToMinutes(item.avgDuration),
    });

    // Adiciona métrica de volume
    result.push({
      colaborador: item.userName,
      metrica: "Volume",
      valor: item.count,
    });

    // Adiciona métricas de atividade

    result.push({
      colaborador: item.userName,
      metrica: "Atividade",
      valor: 85, // Valor padrão
    });
  });

  return result;
};

// Transforma dados do radar individual para o formato do gráfico de radar
const transformIndividualRadarToChart = (data, teamData) => {
  if (!data || !data.kpis) {
    return [];
  }

  // Calcula valores da equipe se disponíveis
  let teamAvgDuration = 0;
  let teamAvgCount = 0;

  if (teamData && teamData.length > 0) {
    teamAvgDuration =
      teamData.reduce((sum, item) => sum + item.avgDuration, 0) /
      teamData.length;
    teamAvgCount =
      teamData.reduce((sum, item) => sum + item.count, 0) / teamData.length;
  }

  // Normaliza os valores para uma escala de 0-100
  // Quanto menor o tempo, melhor a velocidade (por isso invertemos)
  const maxDuration = Math.max(data.kpis.avgDuration, teamAvgDuration) * 1.2; // 20% a mais para escala
  const velocidadeColaborador = Math.min(
    100,
    Math.max(0, 100 - (data.kpis.avgDuration / maxDuration) * 100),
  );
  const velocidadeEquipe = Math.min(
    100,
    Math.max(0, 100 - (teamAvgDuration / maxDuration) * 100),
  );

  const maxCount = Math.max(data.kpis.count, teamAvgCount) * 1.2; // 20% a mais para escala
  const volumeColaborador = Math.min(
    100,
    Math.max(0, (data.kpis.count / maxCount) * 100),
  );
  const volumeEquipe = Math.min(
    100,
    Math.max(0, (teamAvgCount / maxCount) * 100),
  );

  return [
    {
      subject: "Velocidade",
      colaborador: velocidadeColaborador,
      equipe: velocidadeEquipe,
    },
    { subject: "Qualidade", colaborador: 85, equipe: 85 }, // Valores fictícios
    { subject: "Volume", colaborador: volumeColaborador, equipe: volumeEquipe },
  ];
};

// Funções de API com tratamento de erros

// Busca tempo médio de tratativa
export const fetchAverageTime = async ({
  period = "day",
  userId,
  projectId,
  assignmentId,
}) => {
  try {
    const params = { period, userId, projectId, assignmentId };
    const response = await axiosInstance.get(`/insights/kpi/average-time`, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar tempo médio:", error);
    throw error;
  }
};

// Busca performance da equipe
export const fetchTeamPerformance = async ({
  projectId,
  assignmentId,
  period = "day",
}) => {
  try {
    const params = { projectId, assignmentId, period };
    const response = await axiosInstance.get(`/insights/kpi/team-performance`, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar performance da equipe:", error);
    throw error;
  }
};

// Busca volume da equipe
export const fetchTeamVolume = async ({
  projectId,
  assignmentId,
  period = "day",
}) => {
  try {
    const params = { projectId, assignmentId, period };
    const response = await axiosInstance.get(`/insights/kpi/team-volume`, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar volume da equipe:", error);
    throw error;
  }
};

// Busca radar individual
export const fetchIndividualRadar = async ({
  userId,
  projectId,
  assignmentId,
  period = "day",
}) => {
  try {
    const params = { userId, projectId, assignmentId, period };
    const response = await axiosInstance.get(`/insights/kpi/individual-radar`, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar radar individual:", error);
    throw error;
  }
};

// Hooks para uso nos componentes

// Hook para tempo médio de tratativa
export const useAverageTime = (params = {}) => {
  const [data, setData] = useState(null);
  const [previousData, setPreviousData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { period = "day", userId, projectId, assignmentId } = params;

  // Função para buscar dados atuais
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchAverageTime({
        period,
        userId,
        projectId,
        assignmentId,
      });
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [period, userId, projectId, assignmentId]);

  // Função para buscar dados do período anterior para comparação
  const fetchPreviousData = useCallback(async () => {
    let previousPeriod;

    if (period === "day") {
      // Dia anterior
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      previousPeriod = "day";
    } else if (period === "week") {
      // Semana anterior
      previousPeriod = "week";
    } else if (period === "month") {
      // Mês anterior
      previousPeriod = "month";
    }

    if (!previousPeriod) return null;

    try {
      const result = await fetchAverageTime({
        period: previousPeriod,
        userId,
        projectId,
        assignmentId,
      });

      setPreviousData(result);
      return result;
    } catch (err) {
      console.error("Erro ao buscar dados anteriores:", err);
      return null;
    }
  }, [period, userId, projectId, assignmentId]);

  // Efeito para buscar dados quando os parâmetros mudam
  useEffect(() => {
    fetchData();
    fetchPreviousData();
  }, [fetchData, fetchPreviousData]);

  // Transforma os dados para o formato de KPI Card
  const kpiCardData = useMemo(() => {
    return transformAverageTimeToKPICard(data, previousData);
  }, [data, previousData]);

  // Função para recarregar os dados
  const refetch = useCallback(() => {
    return Promise.all([fetchData(), fetchPreviousData()]);
  }, [fetchData, fetchPreviousData]);

  return {
    data,
    previousData,
    loading,
    error,
    kpiCardData,
    refetch,
  };
};

// Hook para volume da equipe
export const useTeamVolume = (params = {}) => {
  const [data, setData] = useState(null);
  const [previousData, setPreviousData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { projectId, assignmentId, period = "day" } = params;

  // Função para buscar dados atuais
  const fetchData = useCallback(async () => {
    if (!projectId || !assignmentId) return null;

    setLoading(true);
    setError(null);

    try {
      const result = await fetchTeamVolume({ projectId, assignmentId, period });
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [projectId, assignmentId, period]);

  // Função para buscar dados do período anterior para comparação
  const fetchPreviousData = useCallback(async () => {
    if (!projectId || !assignmentId) return null;

    let previousPeriod;

    if (period === "day") {
      // Dia anterior
      previousPeriod = "day";
    } else if (period === "week") {
      // Semana anterior
      previousPeriod = "week";
    } else if (period === "month") {
      // Mês anterior
      previousPeriod = "month";
    }

    if (!previousPeriod) return null;

    try {
      const result = await fetchTeamVolume({
        projectId,
        assignmentId,
        period: previousPeriod,
      });

      setPreviousData(result);
      return result;
    } catch (err) {
      console.error("Erro ao buscar dados anteriores:", err);
      return null;
    }
  }, [projectId, assignmentId, period]);

  // Efeito para buscar dados quando os parâmetros mudam
  useEffect(() => {
    fetchData();
    fetchPreviousData();
  }, [fetchData, fetchPreviousData]);

  // Transforma os dados para o formato de KPI Card
  const kpiCardData = useMemo(() => {
    const periodMap = {
      day: "dia",
      week: "semana",
      month: "mês",
    };

    return transformVolumeToKPICard(data, previousData, periodMap[period]);
  }, [data, previousData, period]);

  // Função para recarregar os dados
  const refetch = useCallback(() => {
    return Promise.all([fetchData(), fetchPreviousData()]);
  }, [fetchData, fetchPreviousData]);

  return {
    data,
    previousData,
    loading,
    error,
    kpiCardData,
    refetch,
  };
};

// Hook para performance da equipe
export const useTeamPerformance = (params = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { projectId, assignmentId, period = "day" } = params;

  // Função para buscar dados
  const fetchData = useCallback(async () => {
    if (!projectId || !assignmentId) return null;

    setLoading(true);
    setError(null);

    try {
      const result = await fetchTeamPerformance({
        projectId,
        assignmentId,
        period,
      });
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [projectId, assignmentId, period]);

  // Efeito para buscar dados quando os parâmetros mudam
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Transforma os dados para o formato do gráfico combinado
  const chartData = useMemo(() => {
    return transformTeamPerformanceToChart(data);
  }, [data]);

  // Transforma os dados para o formato do heatmap
  const heatmapData = useMemo(() => {
    return transformTeamPerformanceToHeatmap(data);
  }, [data]);

  // Função para recarregar os dados
  const refetch = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    chartData,
    heatmapData,
    refetch,
  };
};

// Hook para radar individual
export const useIndividualRadar = (params = {}) => {
  const [data, setData] = useState(null);
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { userId, projectId, assignmentId, period = "day" } = params;

  // Função para buscar dados do radar individual
  const fetchRadarData = useCallback(async () => {
    if (!userId || !projectId || !assignmentId) return null;

    setLoading(true);
    setError(null);

    try {
      const result = await fetchIndividualRadar({
        userId,
        projectId,
        assignmentId,
        period,
      });
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [userId, projectId, assignmentId, period]);

  // Função para buscar dados da equipe para comparação
  const fetchTeamData = useCallback(async () => {
    if (!projectId || !assignmentId) return null;

    try {
      const result = await fetchTeamPerformance({
        projectId,
        assignmentId,
        period,
      });
      setTeamData(result);
      return result;
    } catch (err) {
      console.error("Erro ao buscar dados da equipe:", err);
      return null;
    }
  }, [projectId, assignmentId, period]);

  // Efeito para buscar dados quando os parâmetros mudam
  useEffect(() => {
    fetchRadarData();
    fetchTeamData();
  }, [fetchRadarData, fetchTeamData]);

  // Transforma os dados para o formato do gráfico de radar
  const radarChartData = useMemo(() => {
    return transformIndividualRadarToChart(data, teamData);
  }, [data, teamData]);

  // Função para recarregar os dados
  const refetch = useCallback(() => {
    return Promise.all([fetchRadarData(), fetchTeamData()]);
  }, [fetchRadarData, fetchTeamData]);

  return {
    data,
    teamData,
    loading,
    error,
    radarChartData,
    refetch,
  };
};

// Hook principal que combina todos os hooks
export const useKPI = (params = {}) => {
  const { userId, projectId, assignmentId, period = "day" } = params;

  const averageTime = useAverageTime({
    userId,
    projectId,
    assignmentId,
    period,
  });
  const teamVolume = useTeamVolume({ projectId, assignmentId, period });
  const teamPerformance = useTeamPerformance({
    projectId,
    assignmentId,
    period,
  });
  const individualRadar = useIndividualRadar({
    userId,
    projectId,
    assignmentId,
    period,
  });

  // Estado de loading combinado
  const loading = useMemo(() => {
    return (
      averageTime.loading ||
      teamVolume.loading ||
      teamPerformance.loading ||
      individualRadar.loading
    );
  }, [
    averageTime.loading,
    teamVolume.loading,
    teamPerformance.loading,
    individualRadar.loading,
  ]);

  // Estado de erro combinado
  const error = useMemo(() => {
    return (
      averageTime.error ||
      teamVolume.error ||
      teamPerformance.error ||
      individualRadar.error
    );
  }, [
    averageTime.error,
    teamVolume.error,
    teamPerformance.error,
    individualRadar.error,
  ]);

  // Função para recarregar todos os dados
  const refetchAll = useCallback(() => {
    return Promise.all([
      averageTime.refetch(),
      teamVolume.refetch(),
      teamPerformance.refetch(),
      individualRadar.refetch(),
    ]);
  }, [averageTime, teamVolume, teamPerformance, individualRadar]);

  return {
    // Dados de KPI
    queueTimeData: averageTime.kpiCardData,
    volumeData: teamVolume.kpiCardData,
    teamPerformanceData: teamPerformance.chartData,
    teamHeatmapData: teamPerformance.heatmapData,
    radarData: individualRadar.radarChartData,

    // Dados brutos
    rawData: {
      averageTime: averageTime.data,
      teamVolume: teamVolume.data,
      teamPerformance: teamPerformance.data,
      individualRadar: individualRadar.data,
    },

    // Estados
    loading,
    error,

    // Funções
    refetch: refetchAll,

    // Hooks individuais para casos específicos
    hooks: {
      averageTime,
      teamVolume,
      teamPerformance,
      individualRadar,
    },
  };
};

export default useKPI;
