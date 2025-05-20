import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "modules/shared/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "modules/shared/components/ui/select";
import { Progress } from "modules/shared/components/ui/progress";
import { Badge } from "modules/shared/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ChartContainer,
  ChartTooltipContent,
} from "modules/shared/components/ui/chart";

const AnalyticsPage = () => {
  const [selectedProject, setSelectedProject] = useState("1");

  // Mock data for projects
  const projects = [
    { id: "1", name: "Website Redesign" },
    { id: "2", name: "Mobile App Development" },
    { id: "3", name: "CRM Integration" },
    { id: "4", name: "E-commerce Platform" },
    { id: "5", name: "Marketing Dashboard" },
  ];

  // Mock data for project tasks
  const projectTasks = [
    { name: "Design", completed: 100, total: 100 },
    { name: "Frontend", completed: 75, total: 100 },
    { name: "Backend", completed: 60, total: 100 },
    { name: "Testing", completed: 30, total: 100 },
    { name: "Documentation", completed: 10, total: 100 },
  ];

  // Mock data for team members
  const teamMembers = [
    { id: 1, name: "Bruno Araujo", role: "Frontend", tasks: 12, completed: 8 },
    { id: 2, name: "Daniel Silva", role: "Backend", tasks: 15, completed: 9 },
    { id: 3, name: "Eduardo Filho", role: "Design", tasks: 8, completed: 8 },
    { id: 4, name: "Geovana T.", role: "QA", tasks: 10, completed: 3 },
  ];

  // Mock data for project timeline
  const timelineData = [
    { month: "Jan", planned: 10, completed: 12 },
    { month: "Feb", planned: 15, completed: 14 },
    { month: "Mar", planned: 20, completed: 18 },
    { month: "Apr", planned: 25, completed: 22 },
    { month: "May", planned: 30, completed: 25 },
    { month: "Jun", planned: 35, completed: 30 },
  ];

  // Mock data for task distribution
  const taskDistribution = [
    { name: "Completed", value: 63, color: "#10b981" },
    { name: "In Progress", value: 27, color: "#f59e0b" },
    { name: "Not Started", value: 10, color: "#ef4444" },
  ];

  const COLORS = ["#10b981", "#f59e0b", "#ef4444"];

  return (
    <div className="mx-auto flex min-h-full w-full flex-col bg-background p-10 text-foreground">
      <div className="mb-6">
        <h2 className="mb-2 text-2xl font-bold">Produtividade de Projetos</h2>
        <p className="text-muted-foreground">
          Acompanhe o progresso e a produtividade dos projetos
        </p>
      </div>

      <div className="mb-6">
        <Select value={selectedProject} onValueChange={setSelectedProject}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Selecione um projeto" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Progresso Geral
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <Progress value={68} className="mt-2" />
            <p className="mt-2 text-xs text-muted-foreground">
              Prazo: 15 de Agosto, 2024
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Tarefas Concluídas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">63/100</div>
            <Progress value={63} className="mt-2" />
            <p className="mt-2 text-xs text-muted-foreground">
              +8 tarefas concluídas esta semana
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Status do Projeto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge className="bg-amber-500">Em Andamento</Badge>
              <span className="text-sm text-muted-foreground">
                Atualizado há 2 horas
              </span>
            </div>
            <p className="mt-4 text-sm">
              O projeto está progredindo conforme o planejado, com pequenos
              atrasos na fase de testes.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Progresso por Área</CardTitle>
            <CardDescription>
              Progresso das diferentes áreas do projeto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projectTasks.map((task) => (
                <div key={task.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{task.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {task.completed}/{task.total}
                    </span>
                  </div>
                  <Progress value={(task.completed / task.total) * 100} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Tarefas</CardTitle>
            <CardDescription>
              Status atual das tarefas do projeto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {taskDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex justify-center gap-4">
              {taskDistribution.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-xs">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Linha do Tempo do Projeto</CardTitle>
            <CardDescription>
              Comparação entre tarefas planejadas e concluídas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ChartContainer
                config={{
                  planned: {
                    label: "Planejadas",
                    color: "hsl(var(--primary))",
                  },
                  completed: {
                    label: "Concluídas",
                    color: "hsl(var(--success))",
                  },
                }}
                className="h-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={timelineData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="planned"
                      fill="var(--color-planned)"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="completed"
                      fill="var(--color-completed)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Produtividade da Equipe</CardTitle>
            <CardDescription>
              Desempenho dos membros da equipe no projeto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="pb-2 text-left font-medium">Membro</th>
                    <th className="pb-2 text-left font-medium">Função</th>
                    <th className="pb-2 text-left font-medium">Tarefas</th>
                    <th className="pb-2 text-left font-medium">Concluídas</th>
                    <th className="pb-2 text-left font-medium">Progresso</th>
                  </tr>
                </thead>
                <tbody>
                  {teamMembers.map((member) => (
                    <tr key={member.id} className="border-b">
                      <td className="py-3">{member.name}</td>
                      <td className="py-3">{member.role}</td>
                      <td className="py-3">{member.tasks}</td>
                      <td className="py-3">{member.completed}</td>
                      <td className="w-32 py-3">
                        <Progress
                          value={(member.completed / member.tasks) * 100}
                          className="h-2"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
