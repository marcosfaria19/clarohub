import React, { useMemo } from "react";
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
import { Button } from "modules/shared/components/ui/button";
import { CalendarIcon, ArrowRightIcon, CalendarDaysIcon } from "lucide-react";

import VacationStatusBadge from "./VacationStatusBadge";
import { cn } from "modules/shared/lib/utils";
import { Avatar, AvatarImage } from "modules/shared/components/ui/avatar";
import { formatUserName } from "modules/shared/utils/formatUsername";

const VacationTimeline = React.memo(
  ({ limit = 10, vacations = [], loading = false }) => {
    // Get upcoming vacations
    const upcomingVacations = useMemo(() => {
      if (!vacations || vacations.length === 0) return [];

      // Filtra as férias futuras ou em andamento
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const upcoming = vacations
        .filter((vacation) => {
          const endDate = new Date(vacation.endDate);
          endDate.setHours(0, 0, 0, 0);
          return endDate >= today;
        })
        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

      return upcoming.slice(0, limit);
    }, [vacations, limit]);

    // Format date for display
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString("pt-BR");
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
      if (loading) {
        return (
          <div className="flex h-[200px] flex-col items-center justify-center text-center text-muted-foreground">
            <CalendarDaysIcon className="mb-2 h-12 w-12 animate-pulse opacity-20" />
            <h3 className="text-lg font-medium">Carregando...</h3>
          </div>
        );
      }

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
      console.log(vacation);

      return (
        <motion.div
          key={vacation.id || index}
          variants={itemVariants}
          className={cn(
            "mb-3 flex items-start gap-4 rounded-lg border border-input p-3",
            isActive && "border-primary/80 bg-primary/5",
          )}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary">
            <Avatar className="h-9 w-9">
              <AvatarImage
                src={vacation.avatar || "/placeholder.svg"}
                alt={vacation.nome}
              />
            </Avatar>
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{vacation.nome}</h4>
              <VacationStatusBadge status={vacation.status} />
            </div>

            <p className="text-sm text-muted-foreground">
              Gestor: {formatUserName(vacation.gestor)}
            </p>

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
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground",
                )}
              >
                {getDaysUntilText(vacation.startDate)}
              </span>

              {vacation.reason && (
                <span className="max-w-[150px] truncate text-xs italic text-muted-foreground">
                  {vacation.reason}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      );
    };

    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Próximas Férias</CardTitle>
          <CardDescription>
            Visualize as próximas férias agendadas
          </CardDescription>
        </CardHeader>

        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            {loading || upcomingVacations.length === 0 ? (
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

        <CardFooter className="border-t border-input p-4">
          <Button variant="outline" className="w-full" size="sm">
            Ver Todas as Férias
          </Button>
        </CardFooter>
      </Card>
    );
  },
);

VacationTimeline.displayName = "VacationTimeline";

export default VacationTimeline;
