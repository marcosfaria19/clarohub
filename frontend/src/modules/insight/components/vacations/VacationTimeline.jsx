import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "modules/shared/components/ui/card";
import { ScrollArea } from "modules/shared/components/ui/scroll-area";
import { Input } from "modules/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "modules/shared/components/ui/select";
import { Badge } from "modules/shared/components/ui/badge";
import { CalendarDaysIcon, Search } from "lucide-react";

import VacationOverviewCard from "./VacationOverviewCard";
import { sortVacations } from "modules/insight/utils/sortVacation";

const VacationTimeline = React.memo(({ vacations = [], loading = false }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");

  const filteredAndSortedVacations = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let filtered = vacations.filter((vacation) => {
      const startDate = new Date(vacation.startDate);
      return startDate >= today;
    });

    if (searchTerm) {
      filtered = filtered.filter(
        (vacation) =>
          vacation.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vacation.project.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()),
      );
    }

    return sortVacations(filtered, sortBy);
  }, [vacations, searchTerm, sortBy]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
  };

  const renderEmptyState = () => {
    if (loading) {
      return (
        <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
          <CalendarDaysIcon className="mb-2 h-12 w-12 animate-pulse opacity-20" />
          <h3 className="text-lg font-medium">Carregando...</h3>
        </div>
      );
    }

    return (
      <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
        <CalendarDaysIcon className="mb-2 h-12 w-12 opacity-20" />
        <h3 className="text-lg font-medium">Nenhuma férias encontrada</h3>
        <p className="max-w-xs text-sm">Tente ajustar os filtros de busca.</p>
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="mb-1 flex items-center gap-3">
              Férias Próximas
              <Badge className="border-transparent bg-accent text-accent-foreground hover:bg-accent/80">
                {filteredAndSortedVacations.length}{" "}
                {filteredAndSortedVacations.length === 1
                  ? "registro"
                  : "registros"}
              </Badge>
            </CardTitle>
            <CardDescription>
              Visualize as próximas férias dos colaboradores
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Filtros */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search
              className="absolute bottom-2.5 left-3 z-50 text-foreground/50 hover:opacity-80"
              size={20}
            />
            <Input
              placeholder="Buscar por funcionário ou projeto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Data de Início</SelectItem>
              <SelectItem value="employee">Nome do Funcionário</SelectItem>
              <SelectItem value="duration">Duração</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ScrollArea className="h-[calc(100vh-420px)] pr-4">
          {loading || filteredAndSortedVacations.length === 0 ? (
            renderEmptyState()
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-3"
            >
              {filteredAndSortedVacations.map((vacation, index) => (
                <VacationOverviewCard
                  key={vacation.id || vacation._id || index}
                  vacation={vacation}
                  index={index}
                  showDaysUntil={true}
                  animate={true}
                  variants={itemVariants}
                />
              ))}
            </motion.div>
          )}
        </ScrollArea>
      </CardContent>

      <CardFooter className="border-t border-input p-4">
        <p className="text-sm text-muted-foreground">
          Total: {filteredAndSortedVacations.length}{" "}
          {filteredAndSortedVacations.length === 1 ? "registro" : "registros"}
        </p>
      </CardFooter>
    </Card>
  );
});

export default VacationTimeline;
