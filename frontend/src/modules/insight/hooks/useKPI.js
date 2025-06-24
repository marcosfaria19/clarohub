import { useMemo, useCallback } from "react";
import { SWR_KEYS, swrConfig } from "services/swrConfig";
import useSWR from "swr";

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// Converte milissegundos para minutos
const msToMinutes = (ms) => {
  return parseFloat((ms / (1000 * 60)).toFixed(1));
};

// Converte minutos para o formato XminYs
export const formatXminYs = (mins) => {
  const totalSeconds = Math.floor(mins * 60);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
};

// ============================================================================
// DATA TRANSFORMATION FUNCTIONS
// ============================================================================

// Transforma dados de tempo médio para o formato de KPI Card
const transformAverageTimeToKPICard = (data) => {
  if (!data || data.length === 0) {
    return {
      title: "Tempo Médio de Tratativa",
      value: 0,
      unit: "minutos",
      icon: "clock",
    };
  }

  // Calcula a média de todos os usuários
  const totalAvgDuration =
    data.reduce((sum, item) => sum + item.avgDuration, 0) / data.length;
  const avgMinutes = msToMinutes(totalAvgDuration);

  return {
    title: "Tempo Médio de Tratativa",
    value: avgMinutes,
    icon: "clock",
  };
};

// Transforma dados de volume para o formato de KPI Card
const transformVolumeToKPICard = (data, periodLabel) => {
  if (!data) {
    return {
      title: "Volume por Período",
      value: 0,
      unit: "demandas",
      period: periodLabel || "período",
      icon: "chart-bar",
    };
  }

  const currentCount = data.count || 0;

  const periodMap = {
    day: "dia",
    week: "semana",
    month: "mês",
  };

  return {
    title: "Volume por Período",
    value: currentCount,
    unit: "demandas",
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
      valor: "Em Construção",
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

// ============================================================================
// INDIVIDUAL SWR HOOKS
// ============================================================================

// Hook para tempo médio de tratativa
export const useAverageTime = (params = {}) => {
  const { projectId, assignmentId } = params;

  const key = SWR_KEYS.KPI_AVERAGE_TIME(params);

  const {
    data,
    error,
    isLoading: loading,
    isValidating,
    mutate,
  } = useSWR(
    projectId && assignmentId ? key : null,
    swrConfig.fetcher,
    swrConfig,
  );

  // Transforma os dados para o formato de KPI Card
  const kpiCardData = useMemo(() => {
    return transformAverageTimeToKPICard(data);
  }, [data]);

  // Função para recarregar os dados
  const refetch = useCallback(() => {
    return mutate();
  }, [mutate]);

  return {
    data,
    loading,
    error,
    isValidating,
    kpiCardData,
    refetch,
  };
};

// Hook para volume da equipe
export const useTeamVolume = (params = {}) => {
  const { projectId, assignmentId, period = "day" } = params;

  const key = SWR_KEYS.KPI_TEAM_VOLUME(params);

  const {
    data,
    error,
    isLoading: loading,
    isValidating,
    mutate,
  } = useSWR(
    projectId && assignmentId ? key : null,
    swrConfig.fetcher,
    swrConfig,
  );

  // Transforma os dados para o formato de KPI Card
  const kpiCardData = useMemo(() => {
    const periodMap = {
      day: "dia",
      week: "semana",
      month: "mês",
    };

    return transformVolumeToKPICard(data, periodMap[period]);
  }, [data, period]);

  // Função para recarregar os dados
  const refetch = useCallback(() => {
    return mutate();
  }, [mutate]);

  return {
    data,
    loading,
    error,
    isValidating,
    kpiCardData,
    refetch,
  };
};

// Hook para performance da equipe
export const useTeamPerformance = (params = {}) => {
  const { projectId, assignmentId } = params;

  const key = SWR_KEYS.KPI_TEAM_PERFORMANCE(params);

  const {
    data,
    error,
    isLoading: loading,
    isValidating,
    mutate,
  } = useSWR(
    projectId && assignmentId ? key : null,
    swrConfig.fetcher,
    swrConfig,
  );

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
    return mutate();
  }, [mutate]);

  return {
    data,
    loading,
    error,
    isValidating,
    chartData,
    heatmapData,
    refetch,
  };
};

// Hook para radar individual
export const useIndividualRadar = (params = {}) => {
  const { userId, projectId, assignmentId, period = "day" } = params;

  const radarKey = SWR_KEYS.KPI_INDIVIDUAL_RADAR(params);
  const teamKey = SWR_KEYS.KPI_TEAM_PERFORMANCE({
    projectId,
    assignmentId,
    period,
  });

  const {
    data: radarData,
    error: radarError,
    isLoading: radarLoading,
    isValidating: radarValidating,
    mutate: radarMutate,
  } = useSWR(
    userId && projectId && assignmentId ? radarKey : null,
    swrConfig.fetcher,
    swrConfig,
  );

  const {
    data: teamData,
    error: teamError,
    isLoading: teamLoading,
    isValidating: teamValidating,
    mutate: teamMutate,
  } = useSWR(
    projectId && assignmentId ? teamKey : null,
    swrConfig.fetcher,
    swrConfig,
  );

  // Estados combinados
  const loading = radarLoading || teamLoading;
  const error = radarError || teamError;
  const isValidating = radarValidating || teamValidating;

  // Transforma os dados para o formato do gráfico de radar
  const radarChartData = useMemo(() => {
    return transformIndividualRadarToChart(radarData, teamData);
  }, [radarData, teamData]);

  // Função para recarregar os dados
  const refetch = useCallback(() => {
    return Promise.all([radarMutate(), teamMutate()]);
  }, [radarMutate, teamMutate]);

  return {
    data: radarData,
    teamData,
    loading,
    error,
    isValidating,
    radarChartData,
    refetch,
  };
};

// ============================================================================
// MAIN COMPOSITE HOOK
// ============================================================================

// Hook principal que combina todos os hooks
export const useKPI = (params = {}) => {
  const { userId, projectId, assignmentId, period = "day" } = params;

  const averageTime = useAverageTime({
    userId,
    projectId,
    assignmentId,
    period,
  });

  const teamVolume = useTeamVolume({
    projectId,
    assignmentId,
    period,
  });

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

  // Estado de validating combinado
  const isValidating = useMemo(() => {
    return (
      averageTime.isValidating ||
      teamVolume.isValidating ||
      teamPerformance.isValidating ||
      individualRadar.isValidating
    );
  }, [
    averageTime.isValidating,
    teamVolume.isValidating,
    teamPerformance.isValidating,
    individualRadar.isValidating,
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
    isValidating,

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
