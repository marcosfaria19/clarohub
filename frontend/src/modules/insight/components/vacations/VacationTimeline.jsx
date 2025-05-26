import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useVacation } from "./VacationContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "modules/shared/components/ui/card";
import { ScrollArea } from "modules/shared/components/ui/scroll-area";
import { Button } from "modules/shared/components/ui/button";
import {
  CalendarIcon,
  UserIcon,
  ArrowRightIcon,
  CalendarDaysIcon,
} from "lucide-react";

import VacationStatusBadge from "./VacationStatusBadge";
import { cn } from "modules/shared/lib/utils";

const VacationTimeline = React.memo(({ className = "", limit = 10 }) => {
  const { getUpcomingVacations } = useVacation();

  // Get upcoming vacations
  const upcomingVacations = useMemo(() => {
    return getUpcomingVacations().slice(0, limit);
  }, [getUpcomingVacations, limit]);

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString("pt-BR");
  };

  // Calculate days until vacation
  const getDaysUntil = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  // Get days until text
  const getDaysUntilText = (date) => {
    const days = getDaysUntil(date);

    if (days < 0) {
      return "Em andamento";
    } else if (days === 0) {
      return "Hoje";
    } else if (days === 1) {
      return "Amanhã";
    } else {
      return `Em ${days} dias`;
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
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
  };

  // Render empty state
  const renderEmptyState = () => {
    return (
      <div className="flex h-[200px] flex-col items-center justify-center text-center text-muted-foreground">
        <CalendarDaysIcon className="mb-2 h-12 w-12 opacity-20" />
        <h3 className="text-lg font-medium">Nenhuma férias agendada</h3>
        <p className="max-w-xs text-sm">
          Não há férias agendadas para os próximos 60 dias.
        </p>
      </div>
    );
  };

  // Render vacation item
  const renderVacationItem = (vacation, index) => {
    const daysUntil = getDaysUntil(vacation.startDate);
    const isActive = daysUntil <= 0 && getDaysUntil(vacation.endDate) >= 0;

    return (
      <motion.div
        key={vacation.id}
        variants={itemVariants}
        className={cn(
          "mb-3 flex items-start gap-4 rounded-lg border p-3",
          isActive && "border-primary bg-primary/5",
        )}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary">
          <UserIcon className="h-5 w-5" />
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">{vacation.employee}</h4>
            <VacationStatusBadge status={vacation.status} />
          </div>

          <p className="text-sm text-muted-foreground">{vacation.department}</p>

          <div className="flex items-center gap-1 text-sm">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {formatDate(vacation.startDate)}
            </span>
            <ArrowRightIcon className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">
              {formatDate(vacation.endDate)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs",
                isActive
                  ? "bg-primary/20 text-primary"
                  : "bg-secondary text-muted-foreground",
              )}
            >
              {getDaysUntilText(vacation.startDate)}
            </span>

            {vacation.notes && (
              <span className="max-w-[150px] truncate text-xs italic text-muted-foreground">
                {vacation.notes}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>Próximas Férias</CardTitle>
        <CardDescription>
          Visualize as próximas férias agendadas
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {upcomingVacations.length === 0 ? (
            renderEmptyState()
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-1"
            >
              {upcomingVacations.map(renderVacationItem)}
            </motion.div>
          )}
        </ScrollArea>
      </CardContent>

      <CardFooter className="border-t p-4">
        <Button variant="outline" className="w-full" size="sm">
          Ver Todas as Férias
        </Button>
      </CardFooter>
    </Card>
  );
});

VacationTimeline.displayName = "VacationTimeline";

export default VacationTimeline;
