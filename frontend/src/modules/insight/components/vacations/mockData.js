// Mock data for employees
export const employees = [
  {
    id: 1,
    name: "Bruno Araujo",
    department: "Engineering",
    vacationDaysAvailable: 30,
    vacationDaysTaken: 15,
  },
  {
    id: 2,
    name: "Daniel Silva",
    department: "Design",
    vacationDaysAvailable: 30,
    vacationDaysTaken: 0,
  },
  {
    id: 3,
    name: "Eduardo Filho",
    department: "Marketing",
    vacationDaysAvailable: 30,
    vacationDaysTaken: 10,
  },
  {
    id: 4,
    name: "Geovana T.",
    department: "HR",
    vacationDaysAvailable: 30,
    vacationDaysTaken: 5,
  },
  {
    id: 5,
    name: "Isis Lopes",
    department: "Finance",
    vacationDaysAvailable: 30,
    vacationDaysTaken: 20,
  },
  {
    id: 6,
    name: "João Pereira",
    department: "Engineering",
    vacationDaysAvailable: 30,
    vacationDaysTaken: 0,
  },
  {
    id: 7,
    name: "Karla Mendes",
    department: "Product",
    vacationDaysAvailable: 30,
    vacationDaysTaken: 7,
  },
  {
    id: 8,
    name: "Lucas Costa",
    department: "Sales",
    vacationDaysAvailable: 30,
    vacationDaysTaken: 12,
  },
];

// Mock data for vacations
export const vacations = [
  {
    id: 1,
    employeeId: 1,
    employee: "Bruno Araujo",
    department: "Engineering",
    startDate: new Date(2024, 6, 15),
    endDate: new Date(2024, 6, 30),
    status: "APPROVED",
    notes: "Annual leave",
    createdAt: new Date(2024, 5, 1),
    approvedAt: new Date(2024, 5, 5),
    approvedBy: "Maria Gestora",
  },
  {
    id: 2,
    employeeId: 2,
    employee: "Daniel Silva",
    department: "Design",
    startDate: new Date(2024, 7, 1),
    endDate: new Date(2024, 7, 15),
    status: "PENDING",
    notes: "Summer vacation",
    createdAt: new Date(2024, 6, 10),
  },
  {
    id: 3,
    employeeId: 3,
    employee: "Eduardo Filho",
    department: "Marketing",
    startDate: new Date(2024, 7, 20),
    endDate: new Date(2024, 8, 5),
    status: "APPROVED",
    notes: "Family trip",
    createdAt: new Date(2024, 6, 5),
    approvedAt: new Date(2024, 6, 10),
    approvedBy: "Maria Gestora",
  },
  {
    id: 4,
    employeeId: 4,
    employee: "Geovana T.",
    department: "HR",
    startDate: new Date(2024, 8, 10),
    endDate: new Date(2024, 8, 25),
    status: "PENDING",
    notes: "Personal time",
    createdAt: new Date(2024, 7, 1),
  },
  {
    id: 5,
    employeeId: 5,
    employee: "Isis Lopes",
    department: "Finance",
    startDate: new Date(2024, 9, 1),
    endDate: new Date(2024, 9, 15),
    status: "APPROVED",
    notes: "Conference attendance",
    createdAt: new Date(2024, 7, 15),
    approvedAt: new Date(2024, 7, 20),
    approvedBy: "Maria Gestora",
  },
  {
    id: 6,
    employeeId: 1,
    employee: "Bruno Araujo",
    department: "Engineering",
    startDate: new Date(2024, 11, 20),
    endDate: new Date(2025, 0, 5),
    status: "PENDING",
    notes: "Christmas and New Year",
    createdAt: new Date(2024, 9, 1),
  },
  {
    id: 7,
    employeeId: 7,
    employee: "Karla Mendes",
    department: "Product",
    startDate: new Date(2024, 10, 1),
    endDate: new Date(2024, 10, 15),
    status: "APPROVED",
    notes: "Rest period",
    createdAt: new Date(2024, 8, 15),
    approvedAt: new Date(2024, 8, 20),
    approvedBy: "Maria Gestora",
  },
  {
    id: 8,
    employeeId: 8,
    employee: "Lucas Costa",
    department: "Sales",
    startDate: new Date(2025, 1, 1),
    endDate: new Date(2025, 1, 15),
    status: "REJECTED",
    notes: "Team building trip",
    createdAt: new Date(2024, 10, 1),
    rejectedAt: new Date(2024, 10, 5),
    rejectedBy: "Maria Gestora",
    rejectionReason: "High sales season, critical team member",
  },
];

// Helper function to get upcoming vacations (next 60 days)
export const getUpcomingVacations = () => {
  const today = new Date();
  const sixtyDaysFromNow = new Date();
  sixtyDaysFromNow.setDate(today.getDate() + 60);

  return vacations
    .filter(
      (vacation) =>
        vacation.status === "APPROVED" &&
        ((vacation.startDate >= today &&
          vacation.startDate <= sixtyDaysFromNow) ||
          (vacation.startDate <= today && vacation.endDate >= today)),
    )
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
};

// Helper function to get vacations by status
export const getVacationsByStatus = (status) => {
  return vacations.filter((vacation) => vacation.status === status);
};

// Helper function to get vacations by employee
export const getVacationsByEmployee = (employeeId) => {
  return vacations.filter((vacation) => vacation.employeeId === employeeId);
};

// Helper function to get vacations for a specific date range
export const getVacationsInDateRange = (startDate, endDate) => {
  return vacations.filter(
    (vacation) =>
      (vacation.startDate >= startDate && vacation.startDate <= endDate) ||
      (vacation.endDate >= startDate && vacation.endDate <= endDate) ||
      (vacation.startDate <= startDate && vacation.endDate >= endDate),
  );
};

// Helper function to check if a date is within a vacation period
export const getVacationsForDate = (date) => {
  const d = new Date(date).setHours(0, 0, 0, 0);
  return vacations.filter(
    (vacation) =>
      d >= new Date(vacation.startDate).setHours(0, 0, 0, 0) &&
      d <= new Date(vacation.endDate).setHours(0, 0, 0, 0),
  );
};

// Helper function to calculate vacation days
export const calculateVacationDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Set time to midnight to avoid time zone issues
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  // Calculate the difference in days
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days

  return diffDays;
};

// Helper function to check if a new vacation request overlaps with existing ones
export const checkVacationOverlap = (
  employeeId,
  startDate,
  endDate,
  excludeVacationId,
) => {
  const employeeVacations = vacations.filter(
    (v) =>
      v.employeeId === employeeId &&
      (excludeVacationId === undefined || v.id !== excludeVacationId) &&
      (v.status === "APPROVED" || v.status === "PENDING"),
  );

  const newStartTime = startDate.getTime();
  const newEndTime = endDate.getTime();

  return employeeVacations.some((vacation) => {
    const existingStartTime = vacation.startDate.getTime();
    const existingEndTime = vacation.endDate.getTime();

    return (
      (newStartTime >= existingStartTime && newStartTime <= existingEndTime) ||
      (newEndTime >= existingStartTime && newEndTime <= existingEndTime) ||
      (newStartTime <= existingStartTime && newEndTime >= existingEndTime)
    );
  });
};
