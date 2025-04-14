import { PieChart, Pie, Cell } from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "modules/shared/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "modules/shared/components/ui/chart";

const VacationOverview = () => {
  // Mock data for vacation status
  const data = [
    { name: "Férias Agendadas", value: 4 },
    { name: "Férias Pendentes", value: 8 },
    { name: "Em Férias", value: 2 },
    { name: "Férias Concluídas", value: 12 },
  ];

  return (
    <div className="h-80 rounded-lg bg-card p-4 shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-card-foreground">
          Visão Geral de Férias
        </h3>
        <Select defaultValue="2024">
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Ano" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2023">2023</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="h-64">
        <ChartContainer
          config={{
            "Férias Agendadas": {
              label: "Férias Agendadas",
              color: "hsl(var(--primary))",
            },
            "Férias Pendentes": {
              label: "Férias Pendentes",
              color: "hsl(var(--warning))",
            },
            "Em Férias": {
              label: "Em Férias",
              color: "hsl(var(--success))",
            },
            "Férias Concluídas": {
              label: "Férias Concluídas",
              color: "hsl(var(--muted))",
            },
          }}
          className="h-full"
        >
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
            >
              {data.map((entry) => (
                <Cell
                  key={`cell-${entry.name}`}
                  fill={`var(--color-${entry.name})`}
                />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
          </PieChart>
        </ChartContainer>
      </div>
    </div>
  );
};

export default VacationOverview;
