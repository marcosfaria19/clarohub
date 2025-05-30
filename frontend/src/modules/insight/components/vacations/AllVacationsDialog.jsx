import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "modules/shared/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "modules/shared/components/ui/select";
import { ScrollArea } from "modules/shared/components/ui/scroll-area";
import { Input } from "modules/shared/components/ui/input";
import { Badge } from "modules/shared/components/ui/badge";
import { Button } from "modules/shared/components/ui/button";
import { CalendarIcon, Search } from "lucide-react";

import VacationOverviewCard from "./VacationOverviewCard";
import { sortVacations } from "modules/insight/utils/sortVacation";

const AllVacationsDialog = React.memo(
  ({ open, onOpenChange, vacations = [], loading = false }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("date");

    const filteredAndSortedVacations = useMemo(() => {
      let filtered = vacations;

      if (searchTerm) {
        filtered = filtered.filter(
          (vacation) =>
            vacation.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vacation.gestor?.toLowerCase().includes(searchTerm.toLowerCase()),
        );
      }

      return sortVacations(filtered, sortBy);
    }, [vacations, searchTerm, sortBy]);

    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.05 },
      },
    };

    const itemVariants = {
      hidden: { x: -20, opacity: 0 },
      visible: {
        x: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 300, damping: 30 },
      },
    };

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[80vh] max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Todas as Férias
              <Badge variant="basic">
                {filteredAndSortedVacations.length} registros
              </Badge>
            </DialogTitle>
            <DialogDescription>
              Visualize e gerencie todas as férias cadastradas no sistema
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 z-50 h-4 w-4 -translate-y-1/2 transform text-foreground" />
                <Input
                  placeholder="Buscar por funcionário ou gestor..."
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

            {/* Vacation List */}
            <ScrollArea className="h-[400px]">
              {loading ? (
                <div className="flex h-32 items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
              ) : filteredAndSortedVacations.length === 0 ? (
                <div className="flex h-32 flex-col items-center justify-center text-center text-muted-foreground">
                  <CalendarIcon className="mb-2 h-12 w-12 opacity-20" />
                  <h3 className="font-medium">Nenhuma férias encontrada</h3>
                  <p className="text-sm">Tente ajustar os filtros de busca</p>
                </div>
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
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
);

export default AllVacationsDialog;
