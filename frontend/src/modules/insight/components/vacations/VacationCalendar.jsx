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
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "modules/shared/components/ui/avatar";
import {
  ChevronLeft,
  ChevronRight,
  ListIcon,
  LayoutGridIcon,
  User,
} from "lucide-react";
import { cn } from "modules/shared/lib/utils";
import { formatUserName } from "modules/shared/utils/formatUsername";
import { formatDate } from "modules/shared/utils/formatDate";
import VacationStatusBadge, { getStatusConfig } from "./VacationStatusBadge";

const VacationCalendar = React.memo(({ vacations = [] }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [viewMode, setViewMode] = useState("month");
  const [clickedDate, setClickedDate] = useState(null);
  const [currentPersonIndex, setCurrentPersonIndex] = useState(0);

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

  // Format date range for display
  const formatDateRange = useCallback((start, end) => {
    return `${formatDate(start, false)} - ${formatDate(end, false)}`;
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

  // Handle day click
  const handleDayClick = useCallback(
    (day) => {
      const dayVacations = getVacationsForDate(day);
      if (dayVacations.length > 0) {
        setClickedDate(day);
        setCurrentPersonIndex(0);
      } else {
        setClickedDate(null);
        setCurrentPersonIndex(0);
      }
    },
    [getVacationsForDate],
  );

  // Navigate between people on the same day (non-circular)
  const navigatePerson = useCallback(
    (direction) => {
      const dayVacations = getVacationsForDate(clickedDate);
      if (
        direction === "next" &&
        currentPersonIndex < dayVacations.length - 1
      ) {
        setCurrentPersonIndex((prev) => prev + 1);
      } else if (direction === "prev" && currentPersonIndex > 0) {
        setCurrentPersonIndex((prev) => prev - 1);
      }
    },
    [clickedDate, getVacationsForDate, currentPersonIndex],
  );

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

  // Get day cell content with dots only (no grouping)
  const getDayContent = useCallback(
    (day) => {
      const dateVacations = getVacationsForDate(day);
      const isCurrentMonth = day.getMonth() === selectedMonth;
      const isToday = new Date().toDateString() === day.toDateString();
      const isSelected =
        clickedDate && day.toDateString() === clickedDate.toDateString();

      return (
        <motion.div
          className={cn(
            "relative h-full w-full cursor-pointer rounded-lg p-1 transition-all duration-300",
            "hover:bg-secondary/30 hover:ring-1 hover:ring-secondary",
            isCurrentMonth ? "bg-card" : "bg-card/50",
            isToday && "ring-2 ring-primary",
            isSelected && "bg-primary/10 ring-2 ring-primary",
            dateVacations.length > 0 && "hover:scale-105",
          )}
          whileHover={{ scale: dateVacations.length > 0 ? 1.02 : 1 }}
          onClick={() => handleDayClick(day)}
        >
          <div className="flex h-full flex-col items-center justify-center">
            <span
              className={cn(
                "text-sm font-medium",
                !isCurrentMonth && "text-muted-foreground",
              )}
            >
              {day.getDate()}
            </span>

            {dateVacations.length > 0 && (
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 transform">
                <div className="flex max-w-[50px] flex-wrap justify-center gap-0.5">
                  {dateVacations.map((vacation, index) => (
                    <div
                      key={vacation.id || vacation._id || index}
                      className={`h-1.5 w-1.5 rounded-full ${getStatusConfig(vacation.status).className}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      );
    },
    [selectedMonth, getVacationsForDate, clickedDate, handleDayClick],
  );

  // Get tooltip content for a day with names
  const getTooltipContent = useCallback(
    (day) => {
      const dateVacations = getVacationsForDate(day);

      if (dateVacations.length === 0) {
        return (
          <div className="text-xs">
            <div className="font-semibold">Nenhuma férias</div>
            <div className="text-muted-foreground">
              {formatDate(day, false)}
            </div>
          </div>
        );
      }

      return (
        <div className="max-w-xs text-xs">
          <div className="font-semibold">{formatDate(day, false)}</div>
          <div className="mb-2 text-muted-foreground">
            {dateVacations.length} pessoa{dateVacations.length !== 1 ? "s" : ""}{" "}
            em férias
          </div>
          <div className="space-y-1">
            {dateVacations.map((vacation, index) => (
              <div
                key={vacation.id || vacation._id || index}
                className="flex items-center gap-1"
              >
                <User className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {formatUserName(vacation.nome || vacation.employee)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 border-t pt-1 text-muted-foreground">
            Clique para ver detalhes
          </div>
        </div>
      );
    },
    [getVacationsForDate],
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
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="h-full">{getDayContent(day)}</div>
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
      </div>
    );
  }, []);

  // Get this month's vacations for sidebar
  const thisMonthVacations = useMemo(() => {
    return vacations.filter(
      (vacation) =>
        new Date(vacation.startDate).getMonth() === selectedMonth &&
        new Date(vacation.startDate).getFullYear() === selectedYear,
    );
  }, [vacations, selectedMonth, selectedYear]);

  // Get clicked date vacation details
  const clickedDateVacations = useMemo(() => {
    if (!clickedDate) return [];
    return getVacationsForDate(clickedDate);
  }, [clickedDate, getVacationsForDate]);

  const currentVacation = clickedDateVacations[currentPersonIndex];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
      <div className="lg:col-span-3">
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
            <div className="mb-4 flex items-center justify-center gap-4">
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
                    (Semana de {formatDate(generateCalendarDays[0], false)} a{" "}
                    {formatDate(generateCalendarDays[6], false)})
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
              Clique nos dias para ver detalhes das férias
            </div>
          </CardFooter>
        </Card>
      </div>

      <div className="space-y-4">
        {currentVacation && clickedDate && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Detalhes das Férias</CardTitle>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {currentPersonIndex + 1} de {clickedDateVacations.length}
                  </span>
                  {clickedDateVacations.length > 1 && (
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => navigatePerson("prev")}
                        disabled={currentPersonIndex === 0}
                      >
                        <ChevronLeft className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => navigatePerson("next")}
                        disabled={
                          currentPersonIndex === clickedDateVacations.length - 1
                        }
                      >
                        <ChevronRight className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage
                    src={
                      currentVacation.avatar ||
                      "/placeholder.svg?height=40&width=40"
                    }
                    alt={currentVacation.nome || currentVacation.employee}
                  />
                  <AvatarFallback>
                    {(currentVacation.nome || currentVacation.employee)
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {currentVacation.nome || currentVacation.employee}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Gestor: {formatUserName(currentVacation.gestor)}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Período:</span>{" "}
                  {formatDateRange(
                    currentVacation.startDate,
                    currentVacation.endDate,
                  )}
                </p>

                <div className="flex gap-2">
                  <VacationStatusBadge status={currentVacation.status} />
                </div>

                {currentVacation.notes && (
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Observações:</span>{" "}
                    {currentVacation.notes}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Este Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {thisMonthVacations.map((vacation) => (
                <div
                  key={vacation.id || vacation._id}
                  className="flex items-center gap-2"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={
                        vacation.avatar || "/placeholder.svg?height=24&width=24"
                      }
                      alt={vacation.nome || vacation.employee}
                    />
                    <AvatarFallback className="text-xs">
                      {(vacation.nome || vacation.employee)
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {vacation.nome || vacation.employee}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(vacation.startDate, false)} -{" "}
                      {formatDate(vacation.endDate, false)}
                    </p>
                  </div>
                  <div className={`h-2 w-2 rounded-full bg-success`} />
                </div>
              ))}

              {thisMonthVacations.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Nenhuma férias este mês
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

export default VacationCalendar;
