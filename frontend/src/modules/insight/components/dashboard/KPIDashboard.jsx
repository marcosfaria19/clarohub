import React from "react";
import useKPI from "modules/insight/hooks/useKPI";
import KPICard from "./KPICard";

const KPIDashboard = ({ userId, projectId, assignmentId, period = "day" }) => {
  // Utilizando o hook useKPI para obter os dados
  const { queueTimeData, volumeData, loading, error } = useKPI({
    userId,
    projectId,
    assignmentId,
    period,
  });

  if (loading) {
    return <div>Carregando dados...</div>;
  }

  if (error) {
    return <div>Erro ao carregar dados: {error.message}</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* KPI Card para Tempo Médio de Tratativa */}
      <KPICard
        title={queueTimeData.title}
        value={queueTimeData.value}
        unit={queueTimeData.unit}
        trend={queueTimeData.trend}
        trendValue={queueTimeData.trendValue}
        previousValue={queueTimeData.previousValue}
        icon={queueTimeData.icon}
      />

      {/* KPI Card para Volume de Demandas */}
      <KPICard
        title={volumeData.title}
        value={volumeData.value}
        unit={volumeData.unit}
        trend={volumeData.trend}
        trendValue={volumeData.trendValue}
        previousValue={volumeData.previousValue}
        period={volumeData.period}
        icon={volumeData.icon}
      />
    </div>
  );
};

export default KPIDashboard;
