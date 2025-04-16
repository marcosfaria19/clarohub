import React, { useState, useMemo } from "react";
import { Input } from "modules/shared/components/ui/input";
import { SearchIcon } from "lucide-react";

export default function FinishedTaskFilter({
  tasks = [],
  isMobile = false,
  onFilter,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTasks = useMemo(() => {
    if (!searchTerm) return tasks;

    const lowerSearch = searchTerm.toLowerCase();

    return tasks.filter((task) => {
      const id = task.IDDEMANDA?.toString().toLowerCase();
      const endereco = task.ENDERECO_VISTORIA?.toLowerCase();
      const cidade = task.CIDADE?.toLowerCase();
      const uf = task.UF?.toLowerCase();
      const data = task.finishedAtByUser
        ? new Date(task.finishedAtByUser)
            .toLocaleDateString("pt-BR")
            .toLowerCase()
        : "";

      return (
        id?.includes(lowerSearch) ||
        endereco?.includes(lowerSearch) ||
        cidade?.includes(lowerSearch) ||
        uf?.includes(lowerSearch) ||
        data?.includes(lowerSearch)
      );
    });
  }, [tasks, searchTerm]);

  // envia a lista filtrada sempre que ela muda
  React.useEffect(() => {
    onFilter?.(filteredTasks);
  }, [filteredTasks, onFilter]);

  return (
    <div className="relative w-full md:w-48">
      <Input
        placeholder="Buscar finalizadas..."
        className="w-full bg-background p-2"
        size={isMobile ? "sm" : "default"}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <SearchIcon className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
    </div>
  );
}
