import React, { useMemo } from "react";
import { CardFooter } from "modules/shared/components/ui/card";
import { cn } from "modules/shared/lib/utils";
import { formatUserName } from "modules/shared/utils/formatUsername";
import {
  getUserColor,
  getUsersWithVacationsInMonth,
} from "modules/insight/utils/vacationUtils";

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
      <CardFooter className="flex flex-col border-t border-border p-4 sm:flex-row sm:justify-between">
        <div className="text-xs text-muted-foreground">
          Nenhum usuário com férias neste mês
        </div>
        <div className="mt-2 text-xs text-muted-foreground sm:mt-0">
          Clique nos dias para ver detalhes das férias
        </div>
      </CardFooter>
    );
  }

  return (
    <CardFooter className="flex flex-col border-t border-border p-4 sm:flex-row sm:justify-between">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {usersWithVacationsThisMonth.map((user) => (
          <div key={user} className="flex items-center gap-1">
            <div
              className={cn(
                "h-3 w-3 rounded-full",
                getUserColor(userColorMap, user),
              )}
            ></div>
            <span className="text-xs">{formatUserName(user)}</span>
          </div>
        ))}
        {usersWithVacationsThisMonth.length > 10 && (
          <div className="text-xs text-muted-foreground">
            +{usersWithVacationsThisMonth.length - 10} mais
          </div>
        )}
      </div>
      <div className="mt-2 text-xs text-muted-foreground sm:mt-0">
        Clique nos dias para ver detalhes das férias
      </div>
    </CardFooter>
  );
};

export default VacationLegend;
