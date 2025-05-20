import { useState } from "react";
import { Search, Plus, Filter } from "lucide-react";
import { Input } from "modules/shared/components/ui/input";
import { Button } from "modules/shared/components/ui/button";
import { Card, CardContent } from "modules/shared/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "modules/shared/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "modules/shared/components/ui/select";
import { Badge } from "modules/shared/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "modules/shared/components/ui/tabs";

const EmployeeCard = ({ employee }) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-0">
        <div className="flex items-center gap-4 p-4">
          <div className="relative h-12 w-12 overflow-hidden rounded-full">
            <img
              src={employee.avatar || "/placeholder.svg"}
              alt={employee.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-medium">{employee.name}</h3>
            <p className="text-sm text-muted-foreground">{employee.role}</p>
          </div>
          <Badge variant={employee.status === "active" ? "default" : "outline"}>
            {employee.status === "active" ? "Ativo" : "Ausente"}
          </Badge>
        </div>
        <div className="flex border-t">
          <Button
            variant="ghost"
            className="flex-1 rounded-none py-2"
            size="sm"
          >
            Perfil
          </Button>
          <Button
            variant="ghost"
            className="flex-1 rounded-none border-l py-2"
            size="sm"
          >
            Produtividade
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const TeamsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  // Mock data for team members
  const teamMembers = [
    {
      id: 1,
      name: "Bruno Araujo",
      role: "Desenvolvedor Frontend",
      avatar: "/placeholder.svg?height=40&width=40",
      department: "Engineering",
      status: "active",
    },
    {
      id: 2,
      name: "Daniel Silva",
      role: "Desenvolvedor Backend",
      avatar: "/placeholder.svg?height=40&width=40",
      department: "Engineering",
      status: "active",
    },
    {
      id: 3,
      name: "Eduardo Filho",
      role: "Designer UI/UX",
      avatar: "/placeholder.svg?height=40&width=40",
      department: "Design",
      status: "active",
    },
    {
      id: 4,
      name: "Eduardo G.",
      role: "Gerente de Produto",
      avatar: "/placeholder.svg?height=40&width=40",
      department: "Product",
      status: "active",
    },
    {
      id: 5,
      name: "Geovana T.",
      role: "QA Tester",
      avatar: "/placeholder.svg?height=40&width=40",
      department: "Engineering",
      status: "absent",
    },
    {
      id: 6,
      name: "Guilherme M.",
      role: "DevOps Engineer",
      avatar: "/placeholder.svg?height=40&width=40",
      department: "Engineering",
      status: "active",
    },
    {
      id: 7,
      name: "Isis Lopes",
      role: "Analista de Dados",
      avatar: "/placeholder.svg?height=40&width=40",
      department: "Data",
      status: "active",
    },
    {
      id: 8,
      name: "Marcos Faria",
      role: "Gerente de Equipe",
      avatar: "/placeholder.svg?height=40&width=40",
      department: "Management",
      status: "active",
    },
  ];

  // Filter members based on search term, active tab, and selected department
  const filteredMembers = teamMembers.filter((member) => {
    const matchesSearch = member.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === "all" || member.status === activeTab;
    const matchesDepartment =
      selectedDepartment === "all" || member.department === selectedDepartment;
    return matchesSearch && matchesTab && matchesDepartment;
  });

  // Get unique departments for filter
  const departments = ["all", ...new Set(teamMembers.map((m) => m.department))];

  return (
    <div className="mx-auto flex min-h-full w-full flex-col bg-background p-10 text-foreground">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="mb-2 text-2xl font-bold">Equipe</h2>
          <p className="text-muted-foreground">
            Gerencie os membros da sua equipe
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Adicionar Colaborador
        </Button>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
          <Input
            placeholder="Buscar colaborador..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select
            value={selectedDepartment}
            onValueChange={setSelectedDepartment}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Departamento" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept === "all" ? "Todos Departamentos" : dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Mais recentes</DropdownMenuItem>
              <DropdownMenuItem>Ordem alfabética</DropdownMenuItem>
              <DropdownMenuItem>Por departamento</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="active">Ativos</TabsTrigger>
          <TabsTrigger value="absent">Ausentes</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredMembers.map((member) => (
          <EmployeeCard key={member.id} employee={member} />
        ))}
        {filteredMembers.length === 0 && (
          <div className="col-span-full py-8 text-center text-muted-foreground">
            Nenhum colaborador encontrado com os filtros atuais.
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamsPage;
