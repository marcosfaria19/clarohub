import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardTitle,
} from "modules/shared/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "modules/shared/components/ui/table";
import { useKPI } from "modules/insight/hooks/useKPI";

const TeamHeatmap = React.memo(
  ({ className = "", projectId, assignmentId, period = "day" }) => {
    // Usar o hook useKPI para obter dados reais
    const { teamHeatmapData, loading } = useKPI({
      projectId,
      assignmentId,
      period,
    });

    // Usar os dados do hook ou um fallback vazio
    const data = useMemo(() => teamHeatmapData || [], [teamHeatmapData]);

    // Extrair colaboradores e métricas únicos
    const colaboradores = useMemo(
      () => [...new Set(data.map((item) => item.colaborador))],
      [data],
    );

    const metricas = useMemo(
      () => [...new Set(data.map((item) => item.metrica))],
      [data],
    );

    // Calcular valores mínimos e máximos para cada métrica
    const metricRanges = useMemo(() => {
      const ranges = {};

      metricas.forEach((metrica) => {
        const values = data
          .filter((item) => item.metrica === metrica)
          .map((item) => item.valor);

        ranges[metrica] = {
          min: Math.min(...values),
          max: Math.max(...values),
        };
      });

      return ranges;
    }, [data, metricas]);

    // Função para calcular a cor baseada no valor normalizado
    const getColorForValue = (metrica, valor) => {
      if (!metricRanges[metrica])
        return "bg-secondary/50 text-secondary-foreground";

      const { min, max } = metricRanges[metrica];
      const normalizedValue = max === min ? 0.5 : (valor - min) / (max - min);

      // Escala de cores do pior para o melhor
      // Para métricas onde menor é melhor (como Tempo Médio), inverter a escala
      const invertedMetrics = ["Tempo Médio"];
      const shouldInvert = invertedMetrics.includes(metrica);

      const colorValue = shouldInvert ? 1 - normalizedValue : normalizedValue;

      // Escala de cores de vermelho para verde
      if (colorValue < 0.33) {
        return "bg-destructive/80 text-destructive-foreground";
      } else if (colorValue < 0.66) {
        return "bg-warning/80 text-warning-foreground";
      } else {
        return "bg-success/80 text-success-foreground";
      }
    };

    // Função para formatar o valor baseado na métrica
    const formatValue = (metrica, valor) => {
      if (metrica === "Tempo Médio") {
        return `${valor.toFixed(1)}h`;
      } else if (metrica === "Satisfação" || metrica === "Qualidade") {
        return `${valor}%`;
      } else {
        return valor.toString();
      }
    };

    return (
      <Card className={className}>
        <div className="p-6">
          <CardTitle className="mb-4 text-lg font-medium text-foreground">
            Comparação de Colaboradores
          </CardTitle>
        </div>
        <CardContent className="pt-0">
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <p className="text-muted-foreground">Carregando dados...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left text-sm font-medium text-muted-foreground">
                      Colaborador
                    </TableHead>
                    {metricas.map((metrica) => (
                      <TableHead
                        key={metrica}
                        className="text-center text-sm font-medium text-muted-foreground"
                      >
                        {metrica}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {colaboradores.map((colaborador, index) => (
                    <motion.tr
                      key={colaborador}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.05 * index }}
                      className="hover:bg-secondary/20"
                    >
                      <TableCell className="font-medium text-foreground">
                        {colaborador}
                      </TableCell>
                      {metricas.map((metrica) => {
                        const dataPoint = data.find(
                          (item) =>
                            item.colaborador === colaborador &&
                            item.metrica === metrica,
                        );

                        const valor = dataPoint ? dataPoint.valor : 0;
                        const colorClass = getColorForValue(metrica, valor);

                        return (
                          <TableCell key={`${colaborador}-${metrica}`}>
                            <motion.div
                              className={`rounded-md py-1 text-center text-sm font-medium ${colorClass}`}
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.2 }}
                            >
                              {formatValue(metrica, valor)}
                            </motion.div>
                          </TableCell>
                        );
                      })}
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    );
  },
);

TeamHeatmap.displayName = "TeamHeatmap";

export default TeamHeatmap;
