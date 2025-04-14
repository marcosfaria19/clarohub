import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "modules/shared/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "modules/shared/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "modules/shared/components/ui/chart";

const AnalyticsPage = () => {
  const [selectedEmployee, setSelectedEmployee] = useState("1");

  // Mock data for employees
  const employees = [
    { id: "1", name: "Bruno Araujo" },
    { id: "2", name: "Daniel Silva" },
    { id: "3", name: "Eduardo Filho" },
    { id: "4", name: "Eduardo G." },
    { id: "5", name: "Geovana T." },
    { id: "6", name: "Guilherme M." },
    { id: "7", name: "Isis Lopes" },
  ];

  // Mock data for productivity by day
  const productivityData = [
    { day: "Seg", tasks: 9, meetings: 2, hours: 8 },
    { day: "Ter", tasks: 12, meetings: 1, hours: 9 },
    { day: "Qua", tasks: 8, meetings: 3, hours: 8.5 },
    { day: "Qui", tasks: 10, meetings: 2, hours: 8 },
    { day: "Sex", tasks: 7, meetings: 1, hours: 7.5 },
  ];

  // Mock data for performance over time
  const performanceData = [
    { month: "Jan", performance: 75 },
    { month: "Fev", performance: 78 },
    { month: "Mar", performance: 80 },
    { month: "Abr", performance: 82 },
    { month: "Mai", performance: 85 },
    { month: "Jun", performance: 83 },
    { month: "Jul", performance: 88 },
    { month: "Ago", performance: 90 },
    { month: "Set", performance: 87 },
    { month: "Out", performance: 92 },
    { month: "Nov", performance: 94 },
    { month: "Dez", performance: 95 },
  ];

  return (
    <>
      <div className="mb-6">
        <h2 className="mb-2 text-2xl font-bold">Análise Individual</h2>
        <p className="text-muted-foreground">
          Analise o desempenho individual de cada colaborador
        </p>
      </div>

      <div className="mb-6">
        <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Selecione um colaborador" />
          </SelectTrigger>
          <SelectContent>
            {employees.map((employee) => (
              <SelectItem key={employee.id} value={employee.id}>
                {employee.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Tarefas Concluídas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">46</div>
            <p className="text-xs text-muted-foreground">
              +12% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Horas Trabalhadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">168h</div>
            <p className="text-xs text-muted-foreground">
              -2% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Índice de Produtividade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">
              +5% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Produtividade Semanal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
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
                  hours: {
                    label: "Horas",
                    color: "hsl(var(--success-foreground))",
                  },
                }}
                className="h-full"
              >
                <BarChart
                  data={productivityData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
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
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Desempenho Anual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ChartContainer
                config={{
                  performance: {
                    label: "Desempenho",
                    color: "hsl(var(--primary))",
                  },
                }}
                className="h-full"
              >
                <LineChart
                  data={performanceData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="performance"
                    stroke="var(--color-performance)"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AnalyticsPage;
