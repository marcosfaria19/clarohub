import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "modules/shared/components/ui/tooltip";
import { cn } from "modules/shared/lib/utils";
import {
  generateTooltipContent,
  getUserColor,
  getVacationsForDate,
} from "modules/insight/utils/vacationUtils";
import {
  getDayClassNames,
  getDayNumberClassNames,
} from "modules/insight/utils/calendarUtils";

const CalendarDay = ({
  day,
  selectedMonth,
  clickedDate,
  userColorMap,
  vacations,
  onDayClick,
}) => {
  const dateVacations = useMemo(
    () => getVacationsForDate(vacations, day),
    [vacations, day],
  );

  const isCurrentMonth = day.getMonth() === selectedMonth;

  const dayContent = (
    <motion.div
      className={getDayClassNames(
        day,
        selectedMonth,
        clickedDate,
        dateVacations.length,
      )}
      whileHover={{ scale: 1.01 }}
      onClick={() => onDayClick(day)}
    >
      <div className="flex h-full flex-col p-2">
        <div className="flex items-center justify-between">
          <span className={getDayNumberClassNames(isCurrentMonth)}>
            {day.getDate()}
          </span>
        </div>

        {dateVacations.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {dateVacations.slice(0, 3).map((vacation, index) => {
              const employee = vacation.nome;
              return (
                <div
                  key={vacation.id || vacation._id || index}
                  className={cn(
                    "h-2 w-2 rounded-full",
                    getUserColor(userColorMap, employee),
                  )}
                  title={employee}
                />
              );
            })}
            {dateVacations.length > 3 && (
              <div className="flex h-2 w-2 items-center justify-center rounded-full bg-muted text-[6px] font-bold text-muted-foreground">
                +{dateVacations.length - 3}
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );

  const tooltipContent = useMemo(
    () =>
      generateTooltipContent(day, dateVacations, (employee) =>
        getUserColor(userColorMap, employee),
      ),
    [day, dateVacations, userColorMap],
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="h-full">{dayContent}</div>
        </TooltipTrigger>
        <TooltipContent side="top">{tooltipContent}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CalendarDay;
