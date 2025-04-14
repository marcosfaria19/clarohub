import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
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
} from "modules/shared/components/ui/chart";

const TeamPerformance = () => {
  // Mock data for team performance over time
  const data = [
    { month: "Jan", productivity: 65, efficiency: 75, satisfaction: 80 },
    { month: "Fev", productivity: 70, efficiency: 72, satisfaction: 82 },
    { month: "Mar", productivity: 68, efficiency: 78, satisfaction: 79 },
    { month: "Abr", productivity: 75, efficiency: 80, satisfaction: 85 },
    { month: "Mai", productivity: 80, efficiency: 82, satisfaction: 87 },
    { month: "Jun", productivity: 78, efficiency: 85, satisfaction: 84 },
    { month: "Jul", productivity: 82, efficiency: 87, satisfaction: 90 },
    { month: "Ago", productivity: 85, efficiency: 88, satisfaction: 88 },
    { month: "Set", productivity: 83, efficiency: 84, satisfaction: 85 },
    { month: "Out", productivity: 87, efficiency: 90, satisfaction: 92 },
    { month: "Nov", productivity: 89, efficiency: 91, satisfaction: 90 },
    { month: "Dez", productivity: 90, efficiency: 92, satisfaction: 93 },
  ];

  return (
    <div className="h-96 rounded-lg bg-card p-4 shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-card-foreground">
          Desempenho da Equipe
        </h3>
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Métricas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="productivity">Produtividade</SelectItem>
              <SelectItem value="efficiency">Eficiência</SelectItem>
              <SelectItem value="satisfaction">Satisfação</SelectItem>
            </SelectContent>
          </Select>
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
      </div>

      <div className="h-80">
        <ChartContainer
          config={{
            productivity: {
              label: "Produtividade",
              color: "hsl(var(--primary))",
            },
            efficiency: {
              label: "Eficiência",
              color: "hsl(var(--success-foreground))",
            },
            satisfaction: {
              label: "Satisfação",
              color: "hsl(var(--accent))",
            },
          }}
          className="h-full"
        >
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis domain={[0, 100]} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="productivity"
              stroke="var(--color-productivity)"
              activeDot={{ r: 8 }}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="efficiency"
              stroke="var(--color-efficiency)"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="satisfaction"
              stroke="var(--color-satisfaction)"
              strokeWidth={2}
            />
          </LineChart>
        </ChartContainer>
      </div>
    </div>
  );
};

export default TeamPerformance;
