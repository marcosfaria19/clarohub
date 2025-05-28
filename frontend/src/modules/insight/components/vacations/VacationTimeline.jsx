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
import { Button } from "modules/shared/components/ui/button";
import { Badge } from "modules/shared/components/ui/badge";
import { CalendarDaysIcon } from "lucide-react";

import AllVacationsDialog from "./AllVacationsDialog";
import VacationOverviewCard from "./VacationOverviewCard";
import { sortVacations } from "modules/insight/utils/sortVacation";

const VacationTimeline = React.memo(
  ({ limit = 10, vacations = [], loading = false }) => {
    const [showAllVacations, setShowAllVacations] = useState(false);

    const upcomingVacations = useMemo(() => {
      return sortVacations(vacations).slice(0, limit);
    }, [vacations, limit]);

    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
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
          <h3 className="text-lg font-medium">Nenhuma férias agendada</h3>
          <p className="max-w-xs text-sm">
            Não há férias agendadas para os próximos períodos.
          </p>
        </div>
      );
    };

    return (
      <>
        <Card className="w-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-3">
                  Visão Geral de Férias
                  <Badge className="border-transparent bg-accent text-accent-foreground hover:bg-accent/80">
                    {vacations.length}{" "}
                    {vacations.length === 1 ? "registro" : "registros"}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Lista cronológica de férias ordenada por proximidade
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <ScrollArea className="h-[calc(100vh-420px)] pr-4">
              {loading || upcomingVacations.length === 0 ? (
                renderEmptyState()
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-3"
                >
                  {upcomingVacations.map((vacation, index) => (
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
            <Button
              variant="outline"
              className="w-full"
              size="sm"
              onClick={() => setShowAllVacations(true)}
            >
              Ver Todas as Férias
            </Button>
          </CardFooter>
        </Card>

        <AllVacationsDialog
          open={showAllVacations}
          onOpenChange={setShowAllVacations}
          vacations={vacations}
          loading={loading}
        />
      </>
    );
  },
);

export default VacationTimeline;
