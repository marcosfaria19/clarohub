import React, { useCallback, useMemo } from "react";
import { motion } from "framer-motion";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "modules/shared/components/ui/card";
import { Progress } from "modules/shared/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "modules/shared/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "modules/shared/components/ui/select";
import { CalendarIcon, InfoIcon } from "lucide-react";
import { cn } from "modules/shared/lib/utils";

const VacationOverviewCard = React.memo(
  ({
    className = "",
    employeeId,
    onEmployeeChange,
    vacations = [],
    loading = false,
    error = null,
  }) => {
    // We need to extract employees from vacations since we no longer have direct access to employees
    const employees = useMemo(() => {
      if (!vacations || vacations.length === 0) return [];

      // Extract unique employees from vacations
      const uniqueEmployees = new Map();

      vacations.forEach((vacation) => {
        if (vacation.employeeId && !uniqueEmployees.has(vacation.employeeId)) {
          uniqueEmployees.set(vacation.employeeId, {
            id: vacation.employeeId,
            name: vacation.employee,
            department: vacation.department || "",
            vacationDaysAvailable: vacation.daysAvailable || 0,
            vacationDaysTaken: vacation.daysTaken || 0,
          });
        }
      });

      return Array.from(uniqueEmployees.values());
    }, [vacations]);

    // Get selected employee
    const selectedEmployee = useMemo(() => {
      if (!employeeId) return null;
      return employees.find((e) => e.id === employeeId) || null;
    }, [employees, employeeId]);

    // Get employee vacations
    const getVacationsByEmployee = useCallback(
      (empId) => {
        if (!empId || !vacations || vacations.length === 0) return [];
        return vacations.filter((vacation) => vacation.employeeId === empId);
      },
      [vacations],
    );

    // Get employee vacations
    const employeeVacations = useMemo(() => {
      if (!employeeId) return [];
      return getVacationsByEmployee(employeeId);
    }, [employeeId, getVacationsByEmployee]);

    // Calculate vacation statistics
    const vacationStats = useMemo(() => {
      if (!selectedEmployee) {
        return {
          available: 0,
          taken: 0,
          scheduled: 0,
          total: 30,
          percentageUsed: 0,
        };
      }

      const total =
        selectedEmployee.vacationDaysAvailable +
        selectedEmployee.vacationDaysTaken;
      const available = selectedEmployee.vacationDaysAvailable;
      const taken = selectedEmployee.vacationDaysTaken;

      // Calculate scheduled days (pending approval)
      const scheduled = employeeVacations
        .filter((v) => v.status === "pending")
        .reduce((acc, vacation) => {
          const start = new Date(vacation.startDate);
          const end = new Date(vacation.endDate);
          const diffTime = Math.abs(end.getTime() - start.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
          return acc + diffDays;
        }, 0);

      const percentageUsed = Math.round((taken / total) * 100);

      return {
        available,
        taken,
        scheduled,
        total,
        percentageUsed,
      };
    }, [selectedEmployee, employeeVacations]);

    // Handle employee selection change
    const handleEmployeeChange = (value) => {
      if (onEmployeeChange) {
        onEmployeeChange(parseInt(value));
      }
    };

    // Animation variants
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
        },
      },
    };

    const itemVariants = {
      hidden: { y: 20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 300, damping: 30 },
      },
    };

    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Saldo de Férias</CardTitle>
              <CardDescription>
                Visualize o saldo de férias disponível
              </CardDescription>
            </div>

            {onEmployeeChange && (
              <Select
                value={employeeId?.toString()}
                onValueChange={handleEmployeeChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Selecione um funcionário" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem
                      key={employee.id}
                      value={employee.id.toString()}
                    >
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex h-[200px] items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : selectedEmployee ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <motion.div variants={itemVariants} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">
                    {selectedEmployee.name}
                  </h3>
                  <span className="text-sm text-muted-foreground">
                    {selectedEmployee.department}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>Dias utilizados</span>
                    <span className="font-medium">
                      {vacationStats.taken} de {vacationStats.total}
                    </span>
                  </div>
                  <Progress
                    value={vacationStats.percentageUsed}
                    className="h-2"
                  />
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="grid grid-cols-3 gap-4"
              >
                <div className="rounded-lg bg-secondary p-3 text-center">
                  <div className="text-2xl font-bold">
                    {vacationStats.available}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Disponíveis
                  </div>
                </div>

                <div className="rounded-lg bg-secondary p-3 text-center">
                  <div className="text-2xl font-bold">
                    {vacationStats.taken}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Utilizados
                  </div>
                </div>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="relative rounded-lg bg-secondary p-3 text-center">
                        <div className="text-2xl font-bold">
                          {vacationStats.scheduled}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Agendados
                        </div>
                        {vacationStats.scheduled > 0 && (
                          <InfoIcon className="absolute right-2 top-2 h-3 w-3 text-muted-foreground" />
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p className="text-xs">
                        Dias de férias com solicitação pendente de aprovação
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="rounded-lg border p-4"
              >
                <h4 className="mb-2 text-sm font-medium">
                  Informações Adicionais
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CalendarIcon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <span>
                      Você pode solicitar até{" "}
                      <span className="font-medium">
                        {vacationStats.available}
                      </span>{" "}
                      dias de férias
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <InfoIcon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <span>
                      Férias devem ser solicitadas com pelo menos 30 dias de
                      antecedência
                    </span>
                  </li>
                </ul>
              </motion.div>
            </motion.div>
          ) : (
            <div className="flex h-[200px] flex-col items-center justify-center text-center text-muted-foreground">
              <CalendarIcon className="mb-2 h-12 w-12 opacity-20" />
              <h3 className="text-lg font-medium">Selecione um funcionário</h3>
              <p className="max-w-xs text-sm">
                Escolha um funcionário para visualizar o saldo de férias
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="border-t p-4 text-sm text-muted-foreground">
          Última atualização: {new Date().toLocaleDateString("pt-BR")}
        </CardFooter>
      </Card>
    );
  },
);

VacationOverviewCard.displayName = "VacationOverviewCard";

export default VacationOverviewCard;
