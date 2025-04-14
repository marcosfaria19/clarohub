import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "modules/shared/components/ui/input";
import EmployeeCard from "../components/EmployeeCard";

const TeamPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for team members
  const teamMembers = [
    {
      id: 1,
      name: "Bruno Araujo",
      role: "Desenvolvedor Frontend",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "Daniel Silva",
      role: "Desenvolvedor Backend",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      name: "Eduardo Filho",
      role: "Designer UI/UX",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      name: "Eduardo G.",
      role: "Gerente de Produto",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 5,
      name: "Geovana T.",
      role: "QA Tester",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 6,
      name: "Guilherme M.",
      role: "DevOps Engineer",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 7,
      name: "Isis Lopes",
      role: "Analista de Dados",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 8,
      name: "Marcos Faria",
      role: "Gerente de Equipe",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ];

  const filteredMembers = teamMembers.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <>
      <div className="mb-6">
        <h2 className="mb-2 text-2xl font-bold">Equipe</h2>
        <p className="text-muted-foreground">
          Gerencie os membros da sua equipe
        </p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
        <Input
          placeholder="Buscar colaborador..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredMembers.map((member) => (
          <EmployeeCard key={member.id} employee={member} />
        ))}
      </div>
    </>
  );
};

export default TeamPage;
