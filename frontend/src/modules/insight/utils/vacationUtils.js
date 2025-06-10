import { formatUserName } from "modules/shared/utils/formatUsername";
import { formatDate } from "modules/shared/utils/formatDate";

/* Color palette for user representation in the calendar */
export const USER_COLORS = [
  "bg-primary",
  "bg-success",
  "bg-warning",
  "bg-destructive",
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

/* Generate month names with values and labels */
export const generateMonths = () => [
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
];

/* Generate a range of years centered around the current year */
export const generateYears = (range = 3) => {
  const currentYear = new Date().getFullYear();
  return Array.from(
    { length: range * 2 + 1 },
    (_, i) => currentYear - range + i,
  );
};

/* Create a map of users to colors for consistent color assignment */
export const createUserColorMap = (vacations) => {
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
};

/* Get color for a specific user from the color map */
export const getUserColor = (userColorMap, user) => {
  return userColorMap[user] || "bg-muted";
};

/* Format date range for display */
export const formatDateRange = (start, end) => {
  return `${formatDate(start, false)} - ${formatDate(end, false)}`;
};

/* Get vacations for a specific date */
export const getVacationsForDate = (vacations, date) => {
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
};

/* Get vacations for a specific month */
export const getVacationsForMonth = (vacations, year, month) => {
  return vacations.filter((vacation) => {
    const start = new Date(vacation.startDate);
    const end = new Date(vacation.endDate);

    // Check if vacation period overlaps with the selected month
    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 0);

    return start <= monthEnd && end >= monthStart;
  });
};

/* Get unique users from vacation data */

export const getUniqueUsers = (vacations, limit = Infinity) => {
  const users = new Set();
  vacations.forEach((vacation) => {
    users.add(vacation.nome);
  });
  return Array.from(users).slice(0, limit);
};

/* Get unique user objects from vacation data */

export const getUniqueUserObjects = (vacations, limit = Infinity) => {
  const seen = new Set();
  const uniqueUsers = [];

  for (const vacation of vacations) {
    if (!seen.has(vacation.nome)) {
      seen.add(vacation.nome);
      uniqueUsers.push(vacation);
    }
    if (uniqueUsers.length >= limit) break;
  }

  return uniqueUsers;
};

/* Get unique users with vacations in the specified month */

export const getUsersWithVacationsInMonth = (
  vacations,
  year,
  month,
  limit = Infinity,
) => {
  const monthVacations = getVacationsForMonth(vacations, year, month);
  return getUniqueUsers(monthVacations, limit);
};

/* Generate tooltip content for a calendar day */
export const generateTooltipContent = (day, dateVacations, getUserColorFn) => {
  if (dateVacations.length === 0) {
    return (
      <div className="text-xs">
        <div className="font-semibold">Nenhuma férias</div>
        <div className="text-muted-foreground">{formatDate(day, false)}</div>
      </div>
    );
  }

  return (
    <div className="max-w-xs text-xs">
      <div className="font-semibold">{formatDate(day, false)}</div>
      <div className="mb-2 text-muted-foreground">
        {dateVacations.length} pessoa{dateVacations.length !== 1 ? "s" : ""} em
        férias
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
                className={`h-2 w-2 rounded-full ${getUserColorFn(employee)}`}
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
};

const vacationUtils = {
  USER_COLORS,
  generateMonths,
  generateYears,
  createUserColorMap,
  getUserColor,
  formatDateRange,
  getVacationsForDate,
  getVacationsForMonth,
  getUniqueUsers,
  getUsersWithVacationsInMonth,
  generateTooltipContent,
};

export default vacationUtils;
