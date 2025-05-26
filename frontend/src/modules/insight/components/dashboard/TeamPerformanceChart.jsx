import React, { useState, useCallback } from "react";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardTitle,
} from "modules/shared/components/ui/card";
import { useKPI } from "modules/insight/hooks/useKPI";

// Componente de tooltip customizado
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-md border border-border bg-popover p-3 shadow-md">
        <p className="font-medium text-foreground">{label}</p>
        <p className="text-sm text-primary">
          <span className="mr-2 inline-block h-3 w-3 rounded-sm bg-primary"></span>
          Demandas: {payload[0].value}
        </p>
        <p className="text-sm text-accent">
          <span className="mr-2 inline-block h-3 w-3 rounded-sm bg-accent"></span>
          Tempo Médio: {payload[1].value} horas
        </p>
      </div>
    );
  }
  return null;
};

const TeamPerformanceChart = React.memo(
  ({ className = "", projectId, assignmentId, period = "day" }) => {
    const [hoveredBar, setHoveredBar] = useState(null);

    // Usar o hook useKPI para obter dados reais
    const { teamPerformanceData, loading } = useKPI({
      projectId,
      assignmentId,
      period,
    });

    // Usar os dados do hook ou um fallback vazio
    const data = teamPerformanceData || [];

    const handleBarMouseEnter = useCallback((data) => {
      setHoveredBar(data.period);
    }, []);

    const handleBarMouseLeave = useCallback(() => {
      setHoveredBar(null);
    }, []);

    return (
      <Card className={className}>
        <div className="p-6">
          <CardTitle className="mb-4 text-lg font-medium text-foreground">
            Desempenho da Equipe
          </CardTitle>
        </div>
        <CardContent className="pt-0">
          {loading ? (
            <div className="flex h-80 items-center justify-center">
              <p className="text-muted-foreground">Carregando dados...</p>
            </div>
          ) : (
            <motion.div
              className="h-80"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={data}
                  margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="period"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                  />
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                    label={{
                      value: "Demandas",
                      angle: -90,
                      position: "insideLeft",
                      style: { fill: "hsl(var(--muted-foreground))" },
                    }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                    label={{
                      value: "Tempo Médio (h)",
                      angle: -90,
                      position: "insideRight",
                      style: { fill: "hsl(var(--muted-foreground))" },
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{
                      paddingTop: "10px",
                      color: "hsl(var(--foreground))",
                    }}
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="demandas"
                    name="Demandas"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                    onMouseEnter={handleBarMouseEnter}
                    onMouseLeave={handleBarMouseLeave}
                    animationDuration={1500}
                    // Efeito de hover nas barras
                    fillOpacity={(entry) =>
                      hoveredBar === entry.period ? 0.9 : 0.7
                    }
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="tempoMedio"
                    name="Tempo Médio"
                    stroke="hsl(var(--accent))"
                    strokeWidth={2}
                    dot={{
                      r: 4,
                      fill: "hsl(var(--accent))",
                      stroke: "hsl(var(--accent))",
                    }}
                    activeDot={{
                      r: 6,
                      fill: "hsl(var(--accent))",
                      stroke: "hsl(var(--background))",
                    }}
                    animationDuration={2000}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </motion.div>
          )}
        </CardContent>
      </Card>
    );
  },
);

TeamPerformanceChart.displayName = "TeamPerformanceChart";

export default TeamPerformanceChart;
