import React, { useMemo } from "react";
import { CardFooter } from "modules/shared/components/ui/card";
import { cn } from "modules/shared/lib/utils";
import { formatUserName } from "modules/shared/utils/formatUsername";
import {
  getUserColor,
  getUsersWithVacationsInMonth,
} from "modules/insight/utils/vacationUtils";
import { CalendarCheck2 } from "lucide-react";

const VacationLegend = ({
  vacations,
  selectedYear,
  selectedMonth,
  userColorMap,
}) => {
  // Only show users with vacations in the current month
  const usersWithVacationsThisMonth = useMemo(
    () =>
      getUsersWithVacationsInMonth(vacations, selectedYear, selectedMonth, 10),
    [vacations, selectedYear, selectedMonth],
  );

  if (usersWithVacationsThisMonth.length === 0) {
    return (
      <CardFooter className="flex flex-col border-t border-border p-4">
        <div className="flex flex-col items-center justify-center py-3">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full">
            <CalendarCheck2 />
          </div>
          <p className="text-center font-medium text-muted-foreground">
            Nenhum usuário com férias neste mês
          </p>
          <p className="mt-1 text-center text-xs text-muted-foreground">
            Clique nos dias para ver detalhes das férias
          </p>
        </div>
      </CardFooter>
    );
  }

  return (
    <CardFooter className="flex flex-col border-t border-border p-4">
      <div className="flex flex-wrap items-center gap-3">
        {usersWithVacationsThisMonth.map((user) => (
          <div
            key={user}
            className="flex items-center gap-2 rounded-lg border border-border bg-background/80 px-3 py-1.5 shadow-sm backdrop-blur-sm"
          >
            <div
              className={cn(
                "h-3 w-3 rounded-full shadow-sm",
                getUserColor(userColorMap, user),
              )}
            ></div>
            <span className="text-xs font-medium">{formatUserName(user)}</span>
          </div>
        ))}
        {usersWithVacationsThisMonth.length > 10 && (
          <div className="rounded-lg border bg-background/80 px-3 py-1.5 text-xs text-muted-foreground shadow-sm backdrop-blur-sm">
            +{usersWithVacationsThisMonth.length - 10} mais
          </div>
        )}
      </div>
    </CardFooter>
  );
};

export default VacationLegend;
