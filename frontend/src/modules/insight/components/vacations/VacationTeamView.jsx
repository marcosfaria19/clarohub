import { useMemo, useState } from "react";
import { CardContent } from "modules/shared/components/ui/card";
import { Input } from "modules/shared/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "modules/shared/lib/utils";
import {
  getVacationsForDate,
  getUserColor,
  getUniqueUserObjects,
} from "modules/insight/utils/vacationUtils";
import { formatUserName } from "modules/shared/utils/formatUsername";
import { Avatar, AvatarImage } from "modules/shared/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "modules/shared/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";

const VacationTeamView = ({
  selectedMonth,
  selectedYear,
  vacations,
  userColorMap,
  clickedDate,
  onDayClick,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [projectFilter, setProjectFilter] = useState("all");
  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const uniqueProjects = useMemo(() => {
    const projects = new Set();
    vacations.forEach((vacation) => {
      if (vacation.project?.name) {
        projects.add(vacation.project.name);
      }
    });
    return Array.from(projects);
  }, [vacations]);

  const monthUsers = useMemo(() => {
    let filtered = vacations;

    if (projectFilter !== "all") {
      filtered = filtered.filter(
        (vacation) => vacation.project?.name === projectFilter,
      );
    }

    filtered = filtered.filter((vacation) =>
      vacation.nome?.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const uniqueUsers = getUniqueUserObjects(filtered);
    uniqueUsers.sort((a, b) => {
      const nameA = a.nome?.toLowerCase() || "";
      const nameB = b.nome?.toLowerCase() || "";
      return nameA.localeCompare(nameB);
    });

    return uniqueUsers;
  }, [vacations, searchTerm, projectFilter]);

  const monthDays = useMemo(() => {
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    return Array.from(
      { length: daysInMonth },
      (_, i) => new Date(selectedYear, selectedMonth, i + 1),
    );
  }, [selectedYear, selectedMonth]);

  const hasVacationOnDate = (user, date) => {
    const dateVacations = getVacationsForDate(vacations, date);
    return dateVacations.some((vacation) => vacation.nome === user);
  };

  return (
    <CardContent className="p-4">
      <div className="flex h-full flex-col">
        {/* Busca e filtro */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 z-20 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
            <Input
              placeholder="Pesquisar colaboradores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 shadow-sm transition-shadow hover:shadow-md"
            />
          </div>

          <Select value={projectFilter} onValueChange={setProjectFilter}>
            <SelectTrigger className="w-full bg-background shadow-sm transition-shadow hover:shadow-md sm:w-56">
              <SelectValue placeholder="Filtrar por projeto" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto shadow-lg">
              <SelectItem value="all" className="font-medium">
                Todos os projetos
              </SelectItem>
              {uniqueProjects.map((project) => (
                <SelectItem
                  key={project}
                  value={project}
                  className="transition-colors hover:bg-accent"
                >
                  {project}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Container principal */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-lg border border-input shadow-sm">
          <div className="max-h-[500px] flex-1 overflow-auto">
            <div className="flex min-w-max">
              {/* Coluna de Colaboradores */}
              <div className="shadow-right sticky left-0 z-30 flex flex-col bg-background">
                {/* Cabeçalho fixo */}
                <div className="sticky top-0 z-40 flex h-[56.5px] w-[180px] flex-shrink-0 items-center justify-center border-b border-input bg-accent/30 text-sm font-medium text-muted-foreground">
                  Colaboradores
                </div>

                <div className="w-[180px] flex-shrink-0">
                  <AnimatePresence>
                    {monthUsers.map((vacation) => (
                      <motion.div
                        key={vacation.nome}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="group flex h-14 items-center border-b border-input px-3 transition-colors hover:bg-accent/20"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 transition-transform group-hover:scale-105">
                            <AvatarImage
                              src={vacation.avatar || "/placeholder-avatar.png"}
                              alt={vacation.nome}
                              className="object-cover"
                            />
                          </Avatar>
                          <span className="max-w-[110px] truncate text-sm font-medium text-foreground">
                            {formatUserName(vacation.nome)}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Linha do tempo */}
              <div className="flex flex-1 flex-col">
                {/* Cabeçalho de dias */}
                <div className="sticky top-0 z-30 flex border-b border-input bg-accent/30">
                  {monthDays.map((day) => {
                    const isToday =
                      new Date().toDateString() === day.toDateString();
                    const isSelected =
                      clickedDate &&
                      day.toDateString() === clickedDate.toDateString();

                    return (
                      <div
                        key={day.toISOString()}
                        className={cn(
                          "flex h-14 w-[36px] cursor-pointer flex-col items-center justify-center",
                          "text-center transition-all duration-200 hover:bg-accent/50",
                          isToday && "bg-primary/90 text-primary-foreground",
                          isSelected &&
                            !isToday &&
                            "bg-primary/30 text-primary-foreground",
                        )}
                        onClick={() => onDayClick(day)}
                      >
                        <div className="text-[10px] uppercase tracking-wide opacity-80">
                          {weekDays[day.getDay()]}
                        </div>
                        <div
                          className={cn(
                            "mt-0.5 flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold",
                            isToday && "bg-white/20",
                          )}
                        >
                          {day.getDate()}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Férias na linha do tempo */}
                <div>
                  <AnimatePresence>
                    {monthUsers.map((vacation) => (
                      <motion.div
                        key={vacation.nome}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="flex h-14 items-center border-b border-input transition-colors hover:bg-accent/10"
                      >
                        <div className="flex">
                          {monthDays.map((day) => {
                            const hasVacation = hasVacationOnDate(
                              vacation.nome,
                              day,
                            );
                            const isToday =
                              new Date().toDateString() === day.toDateString();
                            const isSelected =
                              clickedDate &&
                              day.toDateString() === clickedDate.toDateString();

                            return (
                              <div
                                key={day.toISOString()}
                                className={cn(
                                  "relative h-14 w-[36px] border-r border-input",
                                  isSelected && "bg-primary/10",
                                  isToday && "bg-primary/5",
                                )}
                              >
                                {hasVacation && (
                                  <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className={cn(
                                      "absolute inset-1 rounded-md",
                                      getUserColor(userColorMap, vacation.nome),
                                      "opacity-90 shadow-sm transition-all hover:shadow-md",
                                    )}
                                    title={`${formatUserName(vacation.nome)} - ${vacation.type === "vacation" ? "Férias" : "Folga"}`}
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          {/* Estado vazio */}
          {monthUsers.length === 0 && (
            <div className="py-12 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="font-medium text-muted-foreground">
                {searchTerm
                  ? "Nenhum colaborador encontrado"
                  : "Nenhum colaborador com férias neste mês"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchTerm
                  ? "Tente ajustar sua pesquisa ou filtros"
                  : "Selecione outro mês ou projeto"}
              </p>
            </div>
          )}
        </div>
      </div>
    </CardContent>
  );
};

export default VacationTeamView;
