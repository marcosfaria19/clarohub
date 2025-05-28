
/**
 * Calendar Utility Functions
 * 
 * This file contains utility functions for calendar generation,
 * view mode handling, and navigation for the Vacation Calendar component.
 */

import { cn } from "modules/shared/lib/utils";
import { formatDate } from "modules/shared/utils/formatDate";

/**
 * Week day names in Portuguese
 */
export const WEEK_DAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

/**
 * Generate calendar days based on view mode and selected date
 * @param {string} viewMode - Calendar view mode ('month' or 'week')
 * @param {number} selectedYear - Selected year
 * @param {number} selectedMonth - Selected month (0-11)
 * @param {Date} selectedDate - Selected date
 * @returns {Array} Array of Date objects representing calendar days
 */
export const generateCalendarDays = (viewMode, selectedYear, selectedMonth, selectedDate) => {
  const days = [];

  if (viewMode === "month") {
    // Generate days for month view (6 weeks grid)
    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1);
    const lastDayOfMonth = new Date(selectedYear, selectedMonth + 1, 0);

    let firstDayOfWeek = firstDayOfMonth.getDay();
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

    // Add days from current month
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      days.push(new Date(selectedYear, selectedMonth, i));
    }

    // Add days from next month to complete the grid (6 weeks * 7 days = 42 cells)
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(selectedYear, selectedMonth + 1, i));
    }
  } else {
    // Generate days for week view (current week)
    const currentDate = new Date(selectedDate);
    const dayOfWeek = currentDate.getDay();
    // Calculate the first day of the week (Monday)
    const diff = currentDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);

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
};

/**
 * Get the date range for a week view
 * @param {Array} days - Array of Date objects representing a week
 * @returns {string} Formatted date range string
 */
export const getWeekDateRange = (days) => {
  if (!days || days.length < 7) return "";
  return `Semana de ${formatDate(days[0], false)} a ${formatDate(days[6], false)}`;
};

/**
 * Navigate to previous period (month or week)
 * @param {Date} currentDate - Current selected date
 * @param {string} viewMode - Calendar view mode ('month' or 'week')
 * @returns {Date} New date after navigation
 */
export const navigateToPreviousPeriod = (currentDate, viewMode) => {
  const newDate = new Date(currentDate);
  if (viewMode === "month") {
    newDate.setMonth(newDate.getMonth() - 1);
  } else {
    newDate.setDate(newDate.getDate() - 7);
  }
  return newDate;
};

/**
 * Navigate to next period (month or week)
 * @param {Date} currentDate - Current selected date
 * @param {string} viewMode - Calendar view mode ('month' or 'week')
 * @returns {Date} New date after navigation
 */
export const navigateToNextPeriod = (currentDate, viewMode) => {
  const newDate = new Date(currentDate);
  if (viewMode === "month") {
    newDate.setMonth(newDate.getMonth() + 1);
  } else {
    newDate.setDate(newDate.getDate() + 7);
  }
  return newDate;
};

/**
 * Generate CSS classes for a calendar day cell
 * @param {Date} day - Calendar day
 * @param {number} selectedMonth - Currently selected month (0-11)
 * @param {Date|null} clickedDate - Currently clicked date
 * @param {number} vacationCount - Number of vacations for this day
 * @returns {string} CSS classes for the day cell
 */
export const getDayClassNames = (day, selectedMonth, clickedDate, vacationCount) => {
  const isCurrentMonth = day.getMonth() === selectedMonth;
  const isToday = new Date().toDateString() === day.toDateString();
  const isSelected = clickedDate && day.toDateString() === clickedDate.toDateString();

  return cn(
    "relative h-full w-full cursor-pointer rounded-md border transition-all duration-200",
    isCurrentMonth ? "bg-container" : "bg-transparent",
    isToday && "border-primary",
    isSelected && "border-primary bg-primary/5",
    !isSelected && !isToday && "border-border",
    vacationCount > 0 && "hover:border-primary/50",
  );
};

/**
 * Generate CSS classes for a day number
 * @param {boolean} isCurrentMonth - Whether the day is in the current month
 * @returns {string} CSS classes for the day number
 */
export const getDayNumberClassNames = (isCurrentMonth) => {
  return cn(
    "text-sm font-medium",
    !isCurrentMonth && "font-normal text-muted-foreground/40",
  );
};

/**
 * Generate CSS classes for the calendar grid
 * @param {string} viewMode - Calendar view mode ('month' or 'week')
 * @returns {string} CSS classes for the calendar grid
 */
export const getCalendarGridClassNames = (viewMode) => {
  return cn(
    "grid gap-2",
    viewMode === "month"
      ? "grid-cols-7 grid-rows-6"
      : "grid-cols-7 grid-rows-1",
  );
};

/**
 * Navigate between people on the same day
 * @param {string} direction - Navigation direction ('prev' or 'next')
 * @param {number} currentIndex - Current person index
 * @param {number} totalCount - Total number of people
 * @returns {number} New index after navigation
 */
export const navigateBetweenPeople = (direction, currentIndex, totalCount) => {
  if (direction === "next" && currentIndex < totalCount - 1) {
    return currentIndex + 1;
  } else if (direction === "prev" && currentIndex > 0) {
    return currentIndex - 1;
  }
  return currentIndex;
};

export default {
  WEEK_DAYS,
  generateCalendarDays,
  getWeekDateRange,
  navigateToPreviousPeriod,
  navigateToNextPeriod,
  getDayClassNames,
  getDayNumberClassNames,
  getCalendarGridClassNames,
  navigateBetweenPeople
};
