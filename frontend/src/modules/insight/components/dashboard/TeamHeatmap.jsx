import React, { useCallback, useMemo } from "react";
import {
  Card,
  CardContent,
  CardTitle,
} from "modules/shared/components/ui/card";
import { motion } from "framer-motion";
import { TabelaPadrao } from "modules/shared/components/TabelaPadrao";
import { formatUserName } from "modules/shared/utils/formatUsername";
import { formatXminYs } from "modules/insight/hooks/useKPI";

const TeamHeatmap = React.memo(
  ({ data = [], className = "", loading = false }) => {
    const heatmapData = useMemo(() => data || [], [data]);

    const colaboradores = useMemo(() => {
      return [...new Set(heatmapData.map((item) => item.colaborador))].sort(
        (a, b) => a.localeCompare(b),
      );
    }, [heatmapData]);

    const metricas = useMemo(() => {
      return [...new Set(heatmapData.map((item) => item.metrica))];
    }, [heatmapData]);

    const metricRanges = useMemo(() => {
      const ranges = {};
      metricas.forEach((metrica) => {
        const valores = heatmapData
          .filter((item) => item.metrica === metrica)
          .map((item) => item.valor);
        ranges[metrica] = {
          min: Math.min(...valores),
          max: Math.max(...valores),
        };
      });
      return ranges;
    }, [heatmapData, metricas]);

    const getColorForValue = useCallback(
      (metrica, valor) => {
        if (!metricRanges[metrica])
          return "bg-secondary/50 text-secondary-foreground";

        const { min, max } = metricRanges[metrica];
        const normalizedValue = max === min ? 0.5 : (valor - min) / (max - min);

        const invertedMetrics = ["Tempo Médio"];
        const shouldInvert = invertedMetrics.includes(metrica);
        const colorValue = shouldInvert ? 1 - normalizedValue : normalizedValue;

        if (colorValue < 0.33)
          return "bg-destructive/80 text-destructive-foreground";
        if (colorValue < 0.66) return "bg-warning/80 text-warning-foreground";
        return "bg-success/80 text-success-foreground";
      },
      [metricRanges],
    );

    const formatValue = (metrica, valor) => {
      if (metrica === "Tempo Médio") return `${formatXminYs(valor)}`;
      if (metrica === "Atividade") return `${valor}%`;
      return valor.toString();
    };

    const tableData = useMemo(() => {
      return colaboradores.map((colaborador) => {
        const row = { colaborador };
        metricas.forEach((metrica) => {
          const dataPoint = heatmapData.find(
            (item) =>
              item.colaborador === colaborador && item.metrica === metrica,
          );
          const valor = dataPoint ? dataPoint.valor : 0;
          row[metrica] = {
            valor,
            formatted: formatValue(metrica, valor),
            className: getColorForValue(metrica, valor),
          };
        });
        return row;
      });
    }, [colaboradores, metricas, heatmapData, getColorForValue]);

    const columns = useMemo(() => {
      const baseColumns = [
        {
          accessorKey: "colaborador",
          header: "Colaborador",
          sorted: true,
          cell: ({ getValue }) => formatUserName(getValue()),
        },
      ];

      const metricaColumns = metricas.map((metrica) => ({
        accessorKey: metrica,
        sorted: true,
        header: metrica,
        sortingFn: (rowA, rowB) => {
          const a = rowA.getValue(metrica)?.valor ?? 0;
          const b = rowB.getValue(metrica)?.valor ?? 0;
          return a - b;
        },
        cell: ({ getValue }) => {
          const value = getValue();
          return (
            <motion.div
              layout
              transition={{ duration: 0.3 }}
              className={`rounded-md py-1 text-center text-sm font-medium ${value.className}`}
            >
              {value.formatted}
            </motion.div>
          );
        },
      }));

      return [...baseColumns, ...metricaColumns];
    }, [metricas]);

    return (
      <Card className={className}>
        <div className="p-6">
          <CardTitle className="mb-4 text-lg font-medium text-foreground">
            Métricas da Equipe
          </CardTitle>
        </div>
        <CardContent className="pt-0">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <TabelaPadrao
              data={tableData}
              columns={columns}
              isLoading={loading}
              pagination={false}
              filterInput={false}
              columnFilter={false}
              actions={false}
            />
          </motion.div>
        </CardContent>
      </Card>
    );
  },
);

TeamHeatmap.displayName = "TeamHeatmap";

export default TeamHeatmap;
