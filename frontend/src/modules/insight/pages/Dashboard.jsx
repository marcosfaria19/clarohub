import { ArrowDown, ArrowUp, Calendar, Clock, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "modules/shared/components/ui/card";
import { Progress } from "modules/shared/components/ui/progress";
import { Button } from "modules/shared/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "modules/shared/components/ui/tabs";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltipContent,
} from "modules/shared/components/ui/chart";

const Dashboard = () => {
  // Mock data for productivity chart
  const productivityData = [
    { name: "Jan", team: 65, individual: 78 },
    { name: "Feb", team: 70, individual: 82 },
    { name: "Mar", team: 68, individual: 75 },
    { name: "Apr", team: 72, individual: 80 },
    { name: "May", team: 75, individual: 85 },
    { name: "Jun", team: 80, individual: 88 },
  ];

  // Mock data for project completion
  const projectData = [
    { name: "Website Redesign", completed: 85 },
    { name: "Mobile App", completed: 65 },
    { name: "CRM Integration", completed: 40 },
    { name: "E-commerce Platform", completed: 25 },
  ];

  // Mock data for upcoming vacations
  const upcomingVacations = [
    { id: 1, employee: "Bruno Araujo", startDate: "15 Jul", endDate: "30 Jul" },
    { id: 2, employee: "Daniel Silva", startDate: "01 Aug", endDate: "15 Aug" },
    {
      id: 3,
      employee: "Eduardo Filho",
      startDate: "20 Aug",
      endDate: "05 Sep",
    },
  ];

  return (
    <div className="mx-auto flex min-h-full w-full flex-col bg-background p-10 text-foreground">
      <div className="mb-6">
        <h2 className="mb-2 text-2xl font-bold">Dashboard de Gerenciamento</h2>
        <p className="text-muted-foreground">
          Acompanhe a produtividade e férias da sua equipe
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <ArrowUp className="h-4 w-4" />
                <span>12%</span>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-sm text-muted-foreground">Membros Ativos</p>
              <h3 className="text-2xl font-bold">24</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <ArrowUp className="h-4 w-4" />
                <span>8%</span>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-sm text-muted-foreground">Horas Trabalhadas</p>
              <h3 className="text-2xl font-bold">1,248</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div className="flex items-center gap-1 text-sm text-red-600">
                <ArrowDown className="h-4 w-4" />
                <span>3%</span>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-sm text-muted-foreground">Férias Pendentes</p>
              <h3 className="text-2xl font-bold">8</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <BarChart className="h-6 w-6 text-primary" />
              </div>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <ArrowUp className="h-4 w-4" />
                <span>5%</span>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-sm text-muted-foreground">Produtividade</p>
              <h3 className="text-2xl font-bold">92%</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Produtividade da Equipe</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="chart">
              <TabsList className="mb-4 grid w-full grid-cols-2">
                <TabsTrigger value="chart">Gráfico</TabsTrigger>
                <TabsTrigger value="table">Tabela</TabsTrigger>
              </TabsList>
              <TabsContent value="chart">
                <div className="h-80">
                  <ChartContainer
                    config={{
                      team: {
                        label: "Equipe",
                        color: "hsl(var(--primary))",
                      },
                      individual: {
                        label: "Individual",
                        color: "hsl(var(--secondary))",
                      },
                    }}
                    className="h-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={productivityData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Line
                          type="monotone"
                          dataKey="team"
                          stroke="var(--color-team)"
                          strokeWidth={2}
                          activeDot={{ r: 8 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="individual"
                          stroke="var(--color-individual)"
                          strokeWidth={2}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </TabsContent>
              <TabsContent value="table">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="pb-2 text-left font-medium">Mês</th>
                        <th className="pb-2 text-left font-medium">Equipe</th>
                        <th className="pb-2 text-left font-medium">
                          Individual
                        </th>
                        <th className="pb-2 text-left font-medium">
                          Diferença
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {productivityData.map((item) => (
                        <tr key={item.name} className="border-b">
                          <td className="py-3">{item.name}</td>
                          <td className="py-3">{item.team}%</td>
                          <td className="py-3">{item.individual}%</td>
                          <td className="py-3">
                            {item.individual > item.team ? (
                              <span className="flex items-center text-green-600">
                                <ArrowUp className="mr-1 h-4 w-4" />
                                {(item.individual - item.team).toFixed(1)}%
                              </span>
                            ) : (
                              <span className="flex items-center text-red-600">
                                <ArrowDown className="mr-1 h-4 w-4" />
                                {(item.team - item.individual).toFixed(1)}%
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Progresso dos Projetos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {projectData.map((project) => (
                <div key={project.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{project.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {project.completed}%
                    </span>
                  </div>
                  <Progress value={project.completed} />
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <Button variant="outline" size="sm">
                Ver Todos os Projetos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Desempenho por Departamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ChartContainer
                  config={{
                    engineering: {
                      label: "Engenharia",
                      color: "hsl(var(--primary))",
                    },
                    design: {
                      label: "Design",
                      color: "hsl(var(--secondary))",
                    },
                    marketing: {
                      label: "Marketing",
                      color: "hsl(var(--accent))",
                    },
                  }}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        {
                          month: "Jan",
                          engineering: 65,
                          design: 78,
                          marketing: 60,
                        },
                        {
                          month: "Feb",
                          engineering: 70,
                          design: 82,
                          marketing: 65,
                        },
                        {
                          month: "Mar",
                          engineering: 68,
                          design: 75,
                          marketing: 70,
                        },
                        {
                          month: "Apr",
                          engineering: 72,
                          design: 80,
                          marketing: 75,
                        },
                        {
                          month: "May",
                          engineering: 75,
                          design: 85,
                          marketing: 80,
                        },
                        {
                          month: "Jun",
                          engineering: 80,
                          design: 88,
                          marketing: 85,
                        },
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Bar
                        dataKey="engineering"
                        fill="var(--color-engineering)"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="design"
                        fill="var(--color-design)"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="marketing"
                        fill="var(--color-marketing)"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Próximas Férias</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingVacations.map((vacation) => (
                  <div
                    key={vacation.id}
                    className="flex items-start gap-4 rounded-lg border p-3"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{vacation.employee}</p>
                      <p className="text-sm text-muted-foreground">
                        {vacation.startDate} - {vacation.endDate}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm">
                  Ver Calendário Completo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
