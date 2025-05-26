import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardTitle,
} from "modules/shared/components/ui/card";
import { useKPI } from "modules/insight/hooks/useKPI";

const PerformanceRadarChart = React.memo(
  ({
    colaborador = "Colaborador",
    className = "",
    userId,
    projectId,
    assignmentId,
    period = "day",
  }) => {
    // Usar o hook useKPI para obter dados reais
    const { radarData, loading } = useKPI({
      userId,
      projectId,
      assignmentId,
      period,
    });

    // Usar os dados do hook ou um fallback vazio
    const data = radarData || [];

    return (
      <Card>
        <div className="p-6">
          <CardTitle className="mb-4 text-lg font-medium text-foreground">
            Performance Individual
          </CardTitle>
          <p className="mb-4 text-sm text-muted-foreground">
            Comparação de {colaborador} com a média da equipe
          </p>
        </div>
        <CardContent className="pt-0">
          <motion.div
            className={`h-80 ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {loading ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-muted-foreground">Carregando dados...</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <Radar
                    name={colaborador}
                    dataKey="colaborador"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.6}
                    animationDuration={1500}
                    animationEasing="ease-out"
                  />
                  <Radar
                    name="Média da Equipe"
                    dataKey="equipe"
                    stroke="hsl(var(--accent))"
                    fill="hsl(var(--accent))"
                    fillOpacity={0.4}
                    animationDuration={1500}
                    animationEasing="ease-out"
                    animationBegin={300}
                  />
                  <Legend
                    wrapperStyle={{
                      paddingTop: "10px",
                      color: "hsl(var(--foreground))",
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            )}
          </motion.div>
        </CardContent>
      </Card>
    );
  },
);

PerformanceRadarChart.displayName = "PerformanceRadarChart";

export default PerformanceRadarChart;
