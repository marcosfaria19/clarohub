import React, { useState, useCallback, useMemo } from "react";
import { Card } from "modules/shared/components/ui/card";
import {
  createUserColorMap,
  getVacationsForDate,
} from "modules/insight/utils/vacationUtils";
import {
  generateCalendarDays,
  navigateBetweenPeople,
  navigateToNextPeriod,
  navigateToPreviousPeriod,
} from "modules/insight/utils/calendarUtils";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import VacationLegend from "./VacationLegend";
import VacationSidebar from "./VacationSidebar";

const VacationCalendar = React.memo(({ vacations = [] }) => {
  // State management
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [viewMode, setViewMode] = useState("month");
  const [clickedDate, setClickedDate] = useState(null);
  const [currentPersonIndex, setCurrentPersonIndex] = useState(0);

  // Create a map of users to colors
  const userColorMap = useMemo(
    () => createUserColorMap(vacations),
    [vacations],
  );

  // Generate calendar days based on current view
  const calendarDays = useMemo(
    () =>
      generateCalendarDays(viewMode, selectedYear, selectedMonth, selectedDate),
    [viewMode, selectedYear, selectedMonth, selectedDate],
  );

  // Get vacations for clicked date
  const clickedDateVacations = useMemo(
    () => (clickedDate ? getVacationsForDate(vacations, clickedDate) : []),
    [clickedDate, vacations],
  );

  // Handle month change
  const handleMonthChange = useCallback(
    (value) => {
      const monthValue = Number.parseInt(value);
      setSelectedMonth(monthValue);
      const newDate = new Date(selectedDate);
      newDate.setMonth(monthValue);
      setSelectedDate(newDate);
    },
    [selectedDate],
  );

  // Handle year change
  const handleYearChange = useCallback(
    (value) => {
      const yearValue = Number.parseInt(value);
      setSelectedYear(yearValue);
      const newDate = new Date(selectedDate);
      newDate.setFullYear(yearValue);
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
    const newDate = navigateToPreviousPeriod(selectedDate, viewMode);
    setSelectedDate(newDate);
    setSelectedMonth(newDate.getMonth());
    setSelectedYear(newDate.getFullYear());
  }, [selectedDate, viewMode]);

  // Navigate to next month/week
  const navigateNext = useCallback(() => {
    const newDate = navigateToNextPeriod(selectedDate, viewMode);
    setSelectedDate(newDate);
    setSelectedMonth(newDate.getMonth());
    setSelectedYear(newDate.getFullYear());
  }, [selectedDate, viewMode]);

  // Handle day click
  const handleDayClick = useCallback(
    (day) => {
      const dayVacations = getVacationsForDate(vacations, day);
      if (dayVacations.length > 0) {
        setClickedDate(day);
        setCurrentPersonIndex(0);
      } else {
        setClickedDate(null);
        setCurrentPersonIndex(0);
      }
    },
    [vacations],
  );

  // Navigate between people on the same day
  const handleNavigatePerson = useCallback(
    (direction) => {
      setCurrentPersonIndex((prev) =>
        navigateBetweenPeople(direction, prev, clickedDateVacations.length),
      );
    },
    [clickedDateVacations.length],
  );

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
      <div className="lg:col-span-3">
        <Card>
          <CalendarHeader
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            viewMode={viewMode}
            calendarDays={calendarDays}
            onMonthChange={handleMonthChange}
            onYearChange={handleYearChange}
            onViewModeChange={handleViewModeChange}
            onNavigatePrevious={navigatePrevious}
            onNavigateNext={navigateNext}
          />

          <CalendarGrid
            viewMode={viewMode}
            calendarDays={calendarDays}
            selectedMonth={selectedMonth}
            clickedDate={clickedDate}
            userColorMap={userColorMap}
            vacations={vacations}
            onDayClick={handleDayClick}
          />

          <VacationLegend
            vacations={vacations}
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            userColorMap={userColorMap}
          />
        </Card>
      </div>

      <VacationSidebar
        vacations={vacations}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        userColorMap={userColorMap}
        clickedDate={clickedDate}
        clickedDateVacations={clickedDateVacations}
        currentPersonIndex={currentPersonIndex}
        onNavigatePerson={handleNavigatePerson}
      />
    </div>
  );
});

export default VacationCalendar;
