import React from "react";

import { CardHeader, CardTitle } from "modules/shared/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "modules/shared/components/ui/select";
import { Button } from "modules/shared/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar, Grid3X3 } from "lucide-react";
import {
  generateMonths,
  generateYears,
} from "modules/insight/utils/vacationUtils";
import { getWeekDateRange } from "modules/insight/utils/calendarUtils";

const CalendarHeader = ({
  selectedMonth,
  selectedYear,
  viewMode,
  calendarDays,
  onMonthChange,
  onYearChange,
  onViewModeChange,
  onNavigatePrevious,
  onNavigateNext,
}) => {
  const months = generateMonths();
  const years = generateYears(3);

  return (
    <CardHeader className="border-b border-border">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 rounded-full p-0 shadow-sm transition-shadow hover:shadow-md"
            onClick={onNavigatePrevious}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="text-center">
            <h3 className="text-xl font-bold text-foreground sm:text-2xl">
              {months[selectedMonth].label} {selectedYear}
            </h3>
            {viewMode === "week" && (
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                {getWeekDateRange(calendarDays)}
              </p>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 rounded-full p-0 shadow-sm transition-shadow hover:shadow-md"
            onClick={onNavigateNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </CardTitle>

        <div className="flex flex-wrap items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center overflow-hidden">
            <Button
              variant={viewMode === "month" ? "default" : "outline"}
              size="sm"
              className="h-9 rounded-r-none px-3 outline-none"
              onClick={() => onViewModeChange("month")}
            >
              <Grid3X3 className="mr-1.5 h-4 w-4" />
              <span className="text-xs">Mês</span>
            </Button>
            <Button
              variant={viewMode === "team" ? "default" : "outline"}
              size="sm"
              className="h-9 rounded-l-none px-3 outline-none"
              onClick={() => onViewModeChange("team")}
            >
              <Calendar className="mr-1.5 h-4 w-4" />
              <span className="text-xs">Time</span>
            </Button>
          </div>

          {/* Month/Year Selectors */}
          <div className="flex gap-2">
            <Select
              value={selectedMonth.toString()}
              onValueChange={onMonthChange}
            >
              <SelectTrigger className="h-9 w-[110px]">
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
              onValueChange={onYearChange}
            >
              <SelectTrigger className="h-9 w-[90px]">
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
      </div>
    </CardHeader>
  );
};

export default CalendarHeader;
