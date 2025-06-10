import { motion, AnimatePresence } from "framer-motion";
import { CardContent } from "modules/shared/components/ui/card";
import {
  getCalendarGridClassNames,
  WEEK_DAYS,
} from "modules/insight/utils/calendarUtils";
import CalendarDay from "./CalendarDay";
import VacationTeamView from "./VacationTeamView";

const CalendarGrid = ({
  viewMode,
  calendarDays,
  selectedMonth,
  selectedYear,
  clickedDate,
  userColorMap,
  vacations,
  onDayClick,
}) => {
  // If team view mode, render the team view component
  if (viewMode === "team") {
    return (
      <VacationTeamView
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        vacations={vacations}
        userColorMap={userColorMap}
        clickedDate={clickedDate}
        onDayClick={onDayClick}
      />
    );
  }

  // Default calendar view
  return (
    <CardContent className="p-3 sm:p-4">
      <div>
        {/* Week days header */}
        <div className="mb-1 grid grid-cols-7 gap-1">
          {WEEK_DAYS.map((day, index) => (
            <div
              key={index}
              className="rounded-t-lg bg-accent/40 p-2 text-center text-xs font-medium tracking-wide text-muted-foreground sm:text-sm"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className={getCalendarGridClassNames(viewMode)}>
          <AnimatePresence mode="wait">
            {calendarDays.map((day, index) => (
              <motion.div
                key={day.toISOString()}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative min-h-[70px]"
              >
                <CalendarDay
                  day={day}
                  selectedMonth={selectedMonth}
                  clickedDate={clickedDate}
                  userColorMap={userColorMap}
                  vacations={vacations}
                  onDayClick={onDayClick}
                  calendarDays={calendarDays}
                  dayIndex={index}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </CardContent>
  );
};

export default CalendarGrid;
