import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CardContent } from "modules/shared/components/ui/card";
import {
  getCalendarGridClassNames,
  WEEK_DAYS,
} from "modules/insight/utils/calendarUtils";
import CalendarDay from "./CalendarDay";

const CalendarGrid = ({
  viewMode,
  calendarDays,
  selectedMonth,
  clickedDate,
  userColorMap,
  vacations,
  onDayClick,
}) => {
  return (
    <CardContent className="p-4">
      <div className="mt-4">
        {/* Week days header */}
        <div className="mb-2 grid grid-cols-7 gap-2">
          {WEEK_DAYS.map((day, index) => (
            <div
              key={index}
              className="p-2 text-center text-xs font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className={getCalendarGridClassNames(viewMode)}>
          <AnimatePresence mode="wait">
            {calendarDays.map((day) => (
              <motion.div
                key={day.toISOString()}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="h-[70px]"
              >
                <CalendarDay
                  day={day}
                  selectedMonth={selectedMonth}
                  clickedDate={clickedDate}
                  userColorMap={userColorMap}
                  vacations={vacations}
                  onDayClick={onDayClick}
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
