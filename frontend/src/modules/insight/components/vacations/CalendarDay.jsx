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
  const isToday = new Date().toDateString() === day.toDateString();

  const dayContent = (
    <motion.div
      className={getDayClassNames(
        day,
        selectedMonth,
        clickedDate,
        dateVacations.length,
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onDayClick(day)}
    >
      <div className="flex h-full flex-col p-2">
        <div className="flex items-center justify-between">
          <span
            className={cn(
              getDayNumberClassNames(isCurrentMonth),
              "flex h-6 w-6 items-center justify-center rounded-full",
              isToday && "bg-primary font-semibold text-primary-foreground",
            )}
          >
            {day.getDate()}
          </span>
        </div>

        {dateVacations.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {/* 3 primeiras bolinhas de status */}
            {dateVacations.slice(0, 5).map((vacation, index) => {
              const employee = vacation.nome;
              return (
                <div
                  key={vacation.id || vacation._id || index}
                  className={cn(
                    "h-3 w-3 rounded-full shadow-sm",
                    getUserColor(userColorMap, employee),
                  )}
                  title={employee}
                />
              );
            })}

            {/* Indicador de férias adicionais */}
            {dateVacations.length > 5 && (
              <div className="flex items-center justify-center">
                <div className="flex h-3 w-3 items-center justify-center rounded-full bg-accent text-[15px] font-bold text-accent-foreground shadow-sm">
                  +{dateVacations.length - 5}
                </div>
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
        <TooltipContent
          side="top"
          className="border border-border/20 bg-popover shadow-lg"
        >
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CalendarDay;
