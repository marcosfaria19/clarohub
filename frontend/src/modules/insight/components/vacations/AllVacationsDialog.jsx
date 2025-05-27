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
import { CalendarIcon, Search, Filter } from "lucide-react";

import VacationOverviewCard from "./VacationOverviewCard";

const AllVacationsDialog = React.memo(
  ({ open, onOpenChange, vacations = [], loading = false }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("date");

    const getDuration = (startDate, endDate) => {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    };

    const filteredAndSortedVacations = useMemo(() => {
      let filtered = vacations;

      // Filter by search term
      if (searchTerm) {
        filtered = filtered.filter(
          (vacation) =>
            (vacation.nome || vacation.employee)
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            vacation.gestor?.toLowerCase().includes(searchTerm.toLowerCase()),
        );
      }

      // Filter by status
      if (statusFilter !== "all") {
        filtered = filtered.filter(
          (vacation) => vacation.status?.toLowerCase() === statusFilter,
        );
      }

      // Sort
      filtered.sort((a, b) => {
        switch (sortBy) {
          case "date":
            return new Date(a.startDate) - new Date(b.startDate);
          case "employee":
            return (a.nome || a.employee)?.localeCompare(b.nome || b.employee);
          case "duration":
            const aDuration = getDuration(a.startDate, a.endDate);
            const bDuration = getDuration(b.startDate, b.endDate);
            return bDuration - aDuration;
          default:
            return 0;
        }
      });

      return filtered;
    }, [vacations, searchTerm, statusFilter, sortBy]);

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
              <Badge variant="secondary">
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
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                <Input
                  placeholder="Buscar por funcionário ou gestor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="approved">Aprovado</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="rejected">Rejeitado</SelectItem>
                  <SelectItem value="canceled">Cancelado</SelectItem>
                </SelectContent>
              </Select>

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
            <ScrollArea className="h-[400px] pr-4">
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
                      showNotes={true}
                      isCompact={true}
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
