import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
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

const EmployeeProductivity = () => {
  // Mock data for employee productivity
  const data = [
    { name: "Bruno A.", tasks: 45, meetings: 12 },
    { name: "Daniel S.", tasks: 38, meetings: 8 },
    { name: "Eduardo F.", tasks: 52, meetings: 15 },
    { name: "Eduardo G.", tasks: 30, meetings: 10 },
    { name: "Geovana T.", tasks: 48, meetings: 9 },
    { name: "Guilherme M.", tasks: 42, meetings: 11 },
  ];

  return (
    <div className="h-80 rounded-lg bg-card p-4 shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-card-foreground">
          Produtividade da Equipe
        </h3>
        <Select defaultValue="7days">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecione o período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Últimos 7 dias</SelectItem>
            <SelectItem value="30days">Últimos 30 dias</SelectItem>
            <SelectItem value="month">Este mês</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="h-64">
        <ChartContainer
          config={{
            tasks: {
              label: "Tarefas",
              color: "hsl(var(--primary))",
            },
            meetings: {
              label: "Reuniões",
              color: "hsl(var(--accent))",
            },
          }}
          className="h-full"
        >
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            barSize={20}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              scale="point"
              padding={{ left: 10, right: 10 }}
            />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="tasks"
              fill="var(--color-tasks)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="meetings"
              fill="var(--color-meetings)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
};

export default EmployeeProductivity;
