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
import { Badge } from "modules/shared/components/ui/badge";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "modules/shared/components/ui/avatar";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Grid3X3,
  Users,
} from "lucide-react";
import { cn } from "modules/shared/lib/utils";
import {
  capitalizeFirstLetters,
  formatUserName,
} from "modules/shared/utils/formatUsername";
import { formatDate } from "modules/shared/utils/formatDate";
import VacationStatusBadge from "./VacationStatusBadge";

// Color palette using CSS variables
const USER_COLORS = [
  "bg-primary",
  "bg-success",
  "bg-warning",
  "bg-destructive",
  "bg-secondary",
  "bg-accent",
  "bg-blue-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-orange-500",
  "bg-green-500",
  "bg-teal-500",
  "bg-indigo-500",
  "bg-red-500",
  "bg-yellow-500",
  "bg-cyan-500",
];

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

  // Generate years for selection
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 7 }, (_, i) => currentYear - 1 + i);
  }, []);

  // Create a map of users to colors
  const userColorMap = useMemo(() => {
    const uniqueUsers = new Set();
    vacations.forEach((vacation) => {
      uniqueUsers.add(vacation.nome);
    });

    const userArray = Array.from(uniqueUsers);
    const colorMap = {};

    userArray.forEach((user, index) => {
      colorMap[user] = USER_COLORS[index % USER_COLORS.length];
    });

    return colorMap;
  }, [vacations]);

  // Get color for a specific user
  const getUserColor = useCallback(
    (user) => {
      return userColorMap[user] || "bg-muted";
    },
    [userColorMap],
  );

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

  // Navigate between people on the same day
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
      const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1);
      const lastDayOfMonth = new Date(selectedYear, selectedMonth + 1, 0);

      let firstDayOfWeek = firstDayOfMonth.getDay();
      if (firstDayOfWeek === 0) firstDayOfWeek = 7;

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

      for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
        days.push(new Date(selectedYear, selectedMonth, i));
      }

      const remainingDays = 42 - days.length;
      for (let i = 1; i <= remainingDays; i++) {
        days.push(new Date(selectedYear, selectedMonth + 1, i));
      }
    } else {
      const currentDate = new Date(selectedDate);
      const dayOfWeek = currentDate.getDay();
      const diff =
        currentDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);

      const weekStart = new Date(currentDate);
      weekStart.setDate(diff);

      for (let i = 0; i < 7; i++) {
        const day = new Date(weekStart);
        day.setDate(weekStart.getDate() + i);
        days.push(day);
      }
    }

    return days;
  }, [selectedYear, selectedMonth, selectedDate, viewMode]);

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
            "relative h-full w-full cursor-pointer rounded-md border transition-all duration-200",
            isCurrentMonth ? "bg-container" : "bg-transparent",
            isToday && "border-primary",
            isSelected && "border-primary bg-primary/5",
            !isSelected && !isToday && "border-border",
            dateVacations.length > 0 && "hover:border-primary/50",
          )}
          whileHover={{ scale: 1.01 }}
          onClick={() => handleDayClick(day)}
        >
          <div className="flex h-full flex-col p-2">
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "text-sm font-medium",
                  !isCurrentMonth && "font-normal text-muted-foreground/40",
                )}
              >
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
                        getUserColor(employee),
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
    },
    [
      selectedMonth,
      getVacationsForDate,
      clickedDate,
      handleDayClick,
      getUserColor,
    ],
  );

  // Clean tooltip content
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
            {dateVacations.map((vacation, index) => {
              const employee = vacation.nome;
              return (
                <div
                  key={vacation.id || vacation._id || index}
                  className="flex items-center gap-1"
                >
                  <div
                    className={cn(
                      "h-2 w-2 rounded-full",
                      getUserColor(employee),
                    )}
                  />
                  <span>{formatUserName(employee)}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-2 border-t pt-1 text-muted-foreground">
            Clique para ver detalhes
          </div>
        </div>
      );
    },
    [getVacationsForDate, getUserColor],
  );

  // Render the calendar grid
  const renderCalendarGrid = useMemo(() => {
    const weekDays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

    return (
      <div className="mt-4">
        {/* Week days header */}
        <div className="mb-2 grid grid-cols-7 gap-2">
          {weekDays.map((day, index) => (
            <div
              key={index}
              className="p-2 text-center text-xs font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div
          className={cn(
            "grid gap-2",
            viewMode === "month"
              ? "grid-cols-7 grid-rows-6"
              : "grid-cols-7 grid-rows-1",
          )}
        >
          <AnimatePresence mode="wait">
            {generateCalendarDays.map((day, index) => (
              <motion.div
                key={day.toISOString()}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
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

  // Get unique users for the legend
  const uniqueUsers = useMemo(() => {
    const users = new Set();
    vacations.forEach((vacation) => {
      users.add(vacation.nome);
    });
    return Array.from(users).slice(0, 10);
  }, [vacations]);

  // Render the legend with user colors
  const renderLegend = useMemo(() => {
    if (uniqueUsers.length === 0) {
      return (
        <div className="text-xs text-muted-foreground">
          Nenhum usuário com férias
        </div>
      );
    }

    return (
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {uniqueUsers.map((user) => (
          <div key={user} className="flex items-center gap-1">
            <div
              className={cn("h-3 w-3 rounded-full", getUserColor(user))}
            ></div>
            <span className="text-xs">{formatUserName(user)}</span>
          </div>
        ))}
        {vacations.length > 0 && uniqueUsers.length > 10 && (
          <div className="text-xs text-muted-foreground">
            +{uniqueUsers.length - 10} mais
          </div>
        )}
      </div>
    );
  }, [uniqueUsers, getUserColor, vacations.length]);

  // Get this month's vacations for sidebar
  const thisMonthVacations = useMemo(() => {
    return vacations.filter((vacation) => {
      const start = new Date(vacation.startDate);
      const end = new Date(vacation.endDate);

      // Se o intervalo das férias se sobrepõe ao mês selecionado
      const monthStart = new Date(selectedYear, selectedMonth, 1);
      const monthEnd = new Date(selectedYear, selectedMonth + 1, 0);

      return start <= monthEnd && end >= monthStart;
    });
  }, [vacations, selectedMonth, selectedYear]);

  // Get clicked date vacation details
  const clickedDateVacations = useMemo(() => {
    if (!clickedDate) return [];
    return getVacationsForDate(clickedDate);
  }, [clickedDate, getVacationsForDate]);

  const currentVacation = clickedDateVacations[currentPersonIndex];
  console.log(currentVacation);
  const currentPerson = capitalizeFirstLetters(currentVacation?.nome);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
      <div className="lg:col-span-3">
        <Card>
          <CardHeader className="border-b border-border">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="flex items-center gap-2 text-xl font-bold">
                Calendário de Férias
              </CardTitle>

              <div className="flex flex-wrap items-center gap-2">
                {/* View Mode Toggle */}
                <div className="flex items-center">
                  <Button
                    variant={viewMode === "month" ? "default" : "outline"}
                    size="sm"
                    className="h-9 rounded-r-none"
                    onClick={() => handleViewModeChange("month")}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "week" ? "default" : "outline"}
                    size="sm"
                    className="h-9 rounded-l-none"
                    onClick={() => handleViewModeChange("week")}
                  >
                    <Calendar className="h-4 w-4" />
                  </Button>
                </div>

                {/* Month/Year Selectors */}
                <Select
                  value={selectedMonth.toString()}
                  onValueChange={handleMonthChange}
                >
                  <SelectTrigger className="h-9 w-[130px]">
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
                  <SelectTrigger className="h-9 w-[100px]">
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
            </div>
          </CardHeader>

          <CardContent className="p-4">
            <div className="mb-4 flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={navigatePrevious}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="text-center">
                <h3 className="text-lg font-medium">
                  {months[selectedMonth].label} {selectedYear}
                </h3>
                {viewMode === "week" && (
                  <p className="text-sm text-muted-foreground">
                    Semana de {formatDate(generateCalendarDays[0], false)} a{" "}
                    {formatDate(generateCalendarDays[6], false)}
                  </p>
                )}
              </div>

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

          <CardFooter className="flex flex-col border-t border-border p-4 sm:flex-row sm:justify-between">
            {renderLegend}
            <div className="mt-2 text-xs text-muted-foreground sm:mt-0">
              Clique nos dias para ver detalhes das férias
            </div>
          </CardFooter>
        </Card>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-4 w-4" />
              Este Mês
              <Badge variant="secondary" className="ml-2">
                {thisMonthVacations.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {thisMonthVacations.map((vacation) => {
                const employee = capitalizeFirstLetters(vacation.nome);
                return (
                  <div
                    key={vacation.id || vacation._id}
                    className="flex items-center gap-2 rounded-md p-2 transition-colors hover:bg-muted/20"
                  >
                    <div className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={
                            vacation.avatar ||
                            "/placeholder.svg?height=32&width=32"
                          }
                          alt={employee}
                        />
                        <AvatarFallback className="text-xs">
                          {employee
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={cn(
                          "absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border-2 border-background",
                          getUserColor(employee),
                        )}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{employee}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(vacation.startDate, false)} -{" "}
                        {formatDate(vacation.endDate, false)}
                      </p>
                    </div>
                    <VacationStatusBadge status={vacation.status} />
                  </div>
                );
              })}

              {thisMonthVacations.length === 0 && (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <Calendar className="mb-2 h-8 w-8 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">
                    Nenhuma férias este mês
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        {currentVacation && clickedDate && (
          <Card>
            <CardHeader className="pb-3">
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
                <div className="relative">
                  <Avatar>
                    <AvatarImage
                      src={
                        currentVacation.avatar ||
                        "/placeholder.svg?height=40&width=40"
                      }
                      alt={currentPerson}
                    />
                    <AvatarFallback>
                      {currentPerson
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background",
                      getUserColor(currentPerson),
                    )}
                  />
                </div>
                <div>
                  <p className="font-medium">{currentPerson}</p>
                  <p className="text-sm text-muted-foreground">
                    Gestor: {formatUserName(currentVacation.gestor)}
                  </p>
                </div>
              </div>

              <div className="rounded-md">
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Período:</span>{" "}
                    {formatDateRange(
                      currentVacation.startDate,
                      currentVacation.endDate,
                    )}
                  </p>

                  {currentVacation.notes && (
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Observações:</span>{" "}
                      {currentVacation.notes}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
});

export default VacationCalendar;
