import React from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "modules/shared/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis } from "recharts";
import { regionals } from "modules/claroflow/utils/regionals";

export default function DemandChart({ tasks, variant }) {
  // Monta os dados do gráfico e filtra regionais sem dados
  const chartData = regionals
    .map((region) => {
      const count = tasks.filter((task) => task.REGIONAL === region).length;
      return { regional: region, count };
    })
    .filter((data) => data.count > 0);

  // Configuração do Chart para a key "count"
  const chartConfig = {
    count: {
      label: "Demandas",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <>
      <h3 className="mb-4 ml-2 font-semibold">
        Distribuição de demandas por regional
      </h3>
      <ChartContainer config={chartConfig} className="h-[300px] w-full">
        <BarChart data={chartData} layout="vertical" margin={{ left: -15 }}>
          <XAxis type="number" dataKey="count" hide />
          <YAxis
            type="category"
            dataKey="regional"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Bar dataKey="count" fill="var(--color-count)" radius={5} />
        </BarChart>
      </ChartContainer>
    </>
  );
}
