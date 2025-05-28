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
        <CardTitle className="flex items-center gap-6">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={onNavigatePrevious}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="text-center">
            <h3 className="text-2xl font-bold">
              {months[selectedMonth].label} {selectedYear}
            </h3>
            {viewMode === "week" && (
              <p className="text-sm text-muted-foreground">
                {getWeekDateRange(calendarDays)}
              </p>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={onNavigateNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </CardTitle>

        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center">
            <Button
              variant={viewMode === "month" ? "default" : "outline"}
              size="sm"
              className="h-9 rounded-r-none"
              onClick={() => onViewModeChange("month")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "week" ? "default" : "outline"}
              size="sm"
              className="h-9 rounded-l-none"
              onClick={() => onViewModeChange("week")}
            >
              <Calendar className="h-4 w-4" />
            </Button>
          </div>

          {/* Month/Year Selectors */}
          <Select
            value={selectedMonth.toString()}
            onValueChange={onMonthChange}
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

          <Select value={selectedYear.toString()} onValueChange={onYearChange}>
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
  );
};

export default CalendarHeader;
