import React, { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "modules/shared/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "modules/shared/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "modules/shared/components/ui/tooltip";
import { Button } from "modules/shared/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  User,
  Info,
  ListIcon,
  LayoutGridIcon,
} from "lucide-react";
import { cn } from "modules/shared/lib/utils";
import { formatUserName } from "modules/shared/utils/formatUsername";

const VacationCalendar = React.memo(({ vacations = [] }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [viewMode, setViewMode] = useState("month");
  const [hoveredDate, setHoveredDate] = useState(null);

  // Generate month names
  const months = useMemo(
    () => [
      { value: "0", label: "Janeiro" },
      { value: "1", label: "Fevereiro" },
      { value: "2", label: "Março" },
      { value: "3", label: "Abril" },
      { value: "4", label: "Maio" },
      { value: "5", label: "Junho" },
      { value: "6", label: "Julho" },
      { value: "7", label: "Agosto" },
      { value: "8", label: "Setembro" },
      { value: "9", label: "Outubro" },
      { value: "10", label: "Novembro" },
      { value: "11", label: "Dezembro" },
    ],
    [],
  );

  // Generate years for selection (current year - 1 to current year + 5)
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 7 }, (_, i) => currentYear - 1 + i);
  }, []);

  const formatDate = useCallback((date) => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d)) return ""; // data inválida
    return d.toLocaleDateString("pt-BR");
  }, []);

  // Format date range for display
  const formatDateRange = useCallback(
    (start, end) => {
      return `${formatDate(start)} - ${formatDate(end)}`;
    },
    [formatDate],
  );

  // Get the status color for a vacation
  const getStatusColor = useCallback((status) => {
    switch (status.toUpperCase()) {
      case "APPROVED":
        return "bg-success";
      case "PENDING":
        /* return "bg-warning"; */
        return "bg-success";
      case "REJECTED":
        return "bg-destructive";
      case "CANCELED":
        return "bg-secondary";
      default:
        return "bg-muted";
    }
  }, []);

  // Get vacations for a specific date
  const getVacationsForDate = useCallback(
    (date) => {
      if (!vacations || vacations.length === 0) return [];

      return vacations.filter((vacation) => {
        const startDate = new Date(vacation.startDate);
        const endDate = new Date(vacation.endDate);
        const checkDate = new Date(date);

        // Reset time part for accurate date comparison
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        checkDate.setHours(0, 0, 0, 0);

        return checkDate >= startDate && checkDate <= endDate;
      });
    },
    [vacations],
  );

  // Handle month change
  const handleMonthChange = useCallback(
    (value) => {
      setSelectedMonth(Number.parseInt(value));
      const newDate = new Date(selectedDate);
      newDate.setMonth(Number.parseInt(value));
      setSelectedDate(newDate);
    },
    [selectedDate],
  );

  // Handle year change
  const handleYearChange = useCallback(
    (value) => {
      setSelectedYear(Number.parseInt(value));
      const newDate = new Date(selectedDate);
      newDate.setFullYear(Number.parseInt(value));
      setSelectedDate(newDate);
    },
    [selectedDate],
  );

  // Handle view mode change
  const handleViewModeChange = useCallback((mode) => {
    setViewMode(mode);
  }, []);

  // Navigate to previous month/week
  const navigatePrevious = useCallback(() => {
    const newDate = new Date(selectedDate);
    if (viewMode === "month") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setDate(newDate.getDate() - 7);
    }
    setSelectedDate(newDate);
    setSelectedMonth(newDate.getMonth());
    setSelectedYear(newDate.getFullYear());
  }, [selectedDate, viewMode]);

  // Navigate to next month/week
  const navigateNext = useCallback(() => {
    const newDate = new Date(selectedDate);
    if (viewMode === "month") {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setSelectedDate(newDate);
    setSelectedMonth(newDate.getMonth());
    setSelectedYear(newDate.getFullYear());
  }, [selectedDate, viewMode]);

  // Generate days for the calendar
  const generateCalendarDays = useMemo(() => {
    const days = [];

    if (viewMode === "month") {
      // Get the first day of the month
      const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1);
      // Get the last day of the month
      const lastDayOfMonth = new Date(selectedYear, selectedMonth + 1, 0);

      // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
      let firstDayOfWeek = firstDayOfMonth.getDay();
      // Adjust for Sunday as first day of week
      if (firstDayOfWeek === 0) firstDayOfWeek = 7;

      // Add days from previous month to fill the first week
      const daysFromPrevMonth = firstDayOfWeek - 1;
      const prevMonth = new Date(selectedYear, selectedMonth, 0);
      for (let i = daysFromPrevMonth; i > 0; i--) {
        days.push(
          new Date(
            selectedYear,
            selectedMonth - 1,
            prevMonth.getDate() - i + 1,
          ),
        );
      }

      // Add all days of the current month
      for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
        days.push(new Date(selectedYear, selectedMonth, i));
      }

      // Add days from next month to complete the grid (6 rows x 7 columns = 42 cells)
      const remainingDays = 42 - days.length;
      for (let i = 1; i <= remainingDays; i++) {
        days.push(new Date(selectedYear, selectedMonth + 1, i));
      }
    } else {
      // Week view: Get the current week starting from Monday
      const currentDate = new Date(selectedDate);
      const dayOfWeek = currentDate.getDay();
      const diff =
        currentDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust for Sunday

      const weekStart = new Date(currentDate);
      weekStart.setDate(diff);

      // Add 7 days starting from Monday
      for (let i = 0; i < 7; i++) {
        const day = new Date(weekStart);
        day.setDate(weekStart.getDate() + i);
        days.push(day);
      }
    }

    return days;
  }, [selectedYear, selectedMonth, selectedDate, viewMode]);

  // Get day cell content
  const getDayContent = useCallback(
    (day) => {
      const dateVacations = getVacationsForDate(day);
      const isCurrentMonth = day.getMonth() === selectedMonth;
      const isToday = new Date().toDateString() === day.toDateString();

      return (
        <motion.div
          className={cn(
            "relative h-full w-full rounded-lg p-1 transition-colors duration-300 hover:bg-secondary/30 hover:ring-1 hover:ring-secondary",
            isCurrentMonth ? "bg-card" : "bg-card/50",
            isToday && "ring-2 ring-primary",
          )}
          whileHover={{ scale: 1.02 }}
          onHoverStart={() => setHoveredDate(day)}
          onHoverEnd={() => setHoveredDate(null)}
        >
          <div className="flex items-start justify-between">
            <span
              className={cn(
                "text-sm font-medium",
                !isCurrentMonth && "text-muted-foreground",
              )}
            >
              {day.getDate()}
            </span>

            {dateVacations.length > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                {dateVacations.length}
              </span>
            )}
          </div>

          {dateVacations.length > 0 && (
            <div className="mt-1 space-y-1">
              {dateVacations.slice(0, 2).map((vacation) => (
                <div
                  key={vacation.id}
                  className={cn(
                    "h-1.5 w-full rounded-sm",
                    getStatusColor(vacation.status),
                  )}
                />
              ))}
              {dateVacations.length > 2 && (
                <div className="text-center text-xs text-muted-foreground">
                  +{dateVacations.length - 2}
                </div>
              )}
            </div>
          )}
        </motion.div>
      );
    },
    [selectedMonth, getVacationsForDate, getStatusColor],
  );

  // Get tooltip content for a day
  const getTooltipContent = useCallback(
    (day) => {
      const dateVacations = getVacationsForDate(day);

      if (dateVacations.length === 0) {
        return (
          <div className="text-xs">
            <div className="font-semibold">Nenhuma férias</div>
            <div className="text-muted-foreground">{formatDate(day)}</div>
          </div>
        );
      }

      return (
        <div className="max-w-xs space-y-2">
          {dateVacations.map((vacation) => (
            <div key={vacation.id} className="text-xs">
              <div className="flex items-center gap-1 font-semibold">
                <User className="h-3 w-3" />
                <span>{formatUserName(vacation.nome)}</span>
              </div>
              <div className="text-muted-foreground">
                {formatDateRange(vacation.startDate, vacation.endDate)}
              </div>
              {vacation.notes && (
                <div className="flex items-start gap-1 italic text-muted-foreground">
                  <Info className="h-3 w-3 shrink-0 translate-y-0.5" />
                  <span>{vacation.notes}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      );
    },
    [getVacationsForDate, formatDate, formatDateRange],
  );

  // Render the calendar grid
  const renderCalendarGrid = useMemo(() => {
    const weekDays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

    return (
      <div className="mt-4">
        {/* Week days header */}
        <div className="mb-1 grid grid-cols-7 gap-1">
          {weekDays.map((day, index) => (
            <div
              key={index}
              className="p-1 text-center text-xs font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div
          className={cn(
            "grid gap-1",
            viewMode === "month"
              ? "grid-cols-7 grid-rows-6"
              : "grid-cols-7 grid-rows-1",
          )}
        >
          <AnimatePresence mode="wait">
            {generateCalendarDays.map((day, index) => (
              <motion.div
                key={day.toISOString()}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2, delay: index * 0.01 }}
                className="h-[70px]"
                onClick={() => setSelectedDate(day)}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="h-full cursor-pointer">
                        {getDayContent(day)}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      {getTooltipContent(day)}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    );
  }, [generateCalendarDays, viewMode, getDayContent, getTooltipContent]);

  // Render the legend
  const renderLegend = useMemo(() => {
    return (
      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded-full bg-success"></div>
          <span>Aprovado</span>
        </div>
        {/* <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-warning"></div>
            <span>Pendente</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-destructive"></div>
            <span>Rejeitado</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-secondary"></div>
            <span>Cancelado</span>
          </div> */}
      </div>
    );
  }, []);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">
          Calendário de Férias
        </CardTitle>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-r-none"
              onClick={() => handleViewModeChange("month")}
              disabled={viewMode === "month"}
            >
              <LayoutGridIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-l-none"
              onClick={() => handleViewModeChange("week")}
              disabled={viewMode === "week"}
            >
              <ListIcon className="h-4 w-4" />
            </Button>
          </div>

          <Select
            value={selectedMonth.toString()}
            onValueChange={handleMonthChange}
          >
            <SelectTrigger className="h-8 w-[130px]">
              <SelectValue placeholder="Mês" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedYear.toString()}
            onValueChange={handleYearChange}
          >
            <SelectTrigger className="h-8 w-[100px]">
              <SelectValue placeholder="Ano" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <div className="mb-4 flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={navigatePrevious}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <h3 className="text-lg font-medium">
            {months[selectedMonth].label} {selectedYear}
            {viewMode === "week" && (
              <span className="ml-2 text-sm text-muted-foreground">
                (Semana de {formatDate(generateCalendarDays[0])} a{" "}
                {formatDate(generateCalendarDays[6])})
              </span>
            )}
          </h3>

          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={navigateNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {renderCalendarGrid}
      </CardContent>

      <CardFooter className="flex justify-between border-t p-4">
        {renderLegend}
        <div className="text-xs text-muted-foreground">
          Passe o mouse sobre as datas para ver detalhes
        </div>
      </CardFooter>
    </Card>
  );
});

VacationCalendar.displayName = "VacationCalendar";

export default VacationCalendar;
