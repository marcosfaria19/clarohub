import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import * as api from "./api";
import {
  vacations as mockVacations,
  employees as mockEmployees,
  getVacationsByStatus as mockGetVacationsByStatus,
  getVacationsByEmployee as mockGetVacationsByEmployee,
  getVacationsInDateRange as mockGetVacationsInDateRange,
  getVacationsForDate as mockGetVacationsForDate,
  checkVacationOverlap as mockCheckVacationOverlap,
  calculateVacationDays as mockCalculateVacationDays,
  getUpcomingVacations as mockGetUpcomingVacations,
} from "./mockData";

// Create the context with a default undefined value
const VacationContext = createContext();

// Custom hook to use the vacation context
export const useVacation = () => {
  const context = useContext(VacationContext);
  if (!context) {
    throw new Error("useVacation must be used within a VacationProvider");
  }
  return context;
};

export const VacationProvider = ({
  children,
  useMockData = true, // Default to using mock data for development
}) => {
  const [vacations, setVacations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [viewMode, setViewMode] = useState("month");

  // Function to refresh vacations data
  const refreshVacations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (useMockData) {
        // Use mock data
        setVacations(mockVacations);
        setEmployees(mockEmployees);
      } else {
        // Fetch data from API
        const [vacationsData, employeesData] = await Promise.all([
          api.getVacations(),
          api.getEmployees(),
        ]);
        setVacations(vacationsData);
        setEmployees(employeesData);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
      console.error("Error refreshing vacations:", err);
    } finally {
      setLoading(false);
    }
  }, [useMockData]);

  // Load initial data
  useEffect(() => {
    refreshVacations();
  }, [refreshVacations]);

  // Add a new vacation
  const addVacation = useCallback(
    async (vacationData) => {
      try {
        setLoading(true);

        if (useMockData) {
          // Simulate API call with mock data
          const newId =
            vacations.length > 0
              ? Math.max(...vacations.map((v) => v.id)) + 1
              : 1;

          const newVacation = {
            ...vacationData,
            id: newId,
            createdAt: new Date(),
          };

          setVacations((prev) => [...prev, newVacation]);
        } else {
          // Call API to create vacation
          const newVacation = await api.createVacation(vacationData);
          setVacations((prev) => [...prev, newVacation]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to add vacation");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [vacations, useMockData],
  );

  // Update a vacation
  const updateVacation = useCallback(
    async (id, updates) => {
      try {
        setLoading(true);

        if (useMockData) {
          // Update in mock data
          setVacations((prev) =>
            prev.map((vacation) =>
              vacation.id === id ? { ...vacation, ...updates } : vacation,
            ),
          );
        } else {
          // Call API to update vacation
          const updatedVacation = await api.updateVacation(id, updates);
          setVacations((prev) =>
            prev.map((vacation) =>
              vacation.id === id ? updatedVacation : vacation,
            ),
          );
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to update vacation",
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [useMockData],
  );

  // Approve a vacation
  const approveVacation = useCallback(
    async (id, approverName) => {
      try {
        setLoading(true);

        if (useMockData) {
          // Update in mock data
          setVacations((prev) =>
            prev.map((vacation) =>
              vacation.id === id
                ? {
                    ...vacation,
                    status: "APPROVED",
                    approvedAt: new Date(),
                    approvedBy: approverName,
                  }
                : vacation,
            ),
          );
        } else {
          // Call API to approve vacation
          const updatedVacation = await api.approveVacation(id, approverName);
          setVacations((prev) =>
            prev.map((vacation) =>
              vacation.id === id ? updatedVacation : vacation,
            ),
          );
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to approve vacation",
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [useMockData],
  );

  // Reject a vacation
  const rejectVacation = useCallback(
    async (id, rejectorName, reason) => {
      try {
        setLoading(true);

        if (useMockData) {
          // Update in mock data
          setVacations((prev) =>
            prev.map((vacation) =>
              vacation.id === id
                ? {
                    ...vacation,
                    status: "REJECTED",
                    rejectedAt: new Date(),
                    rejectedBy: rejectorName,
                    rejectionReason: reason,
                  }
                : vacation,
            ),
          );
        } else {
          // Call API to reject vacation
          const updatedVacation = await api.rejectVacation(
            id,
            rejectorName,
            reason,
          );
          setVacations((prev) =>
            prev.map((vacation) =>
              vacation.id === id ? updatedVacation : vacation,
            ),
          );
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to reject vacation",
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [useMockData],
  );

  // Cancel a vacation
  const cancelVacation = useCallback(
    async (id, cancellerName, reason) => {
      try {
        setLoading(true);

        if (useMockData) {
          // Update in mock data
          setVacations((prev) =>
            prev.map((vacation) =>
              vacation.id === id
                ? {
                    ...vacation,
                    status: "CANCELED",
                    canceledAt: new Date(),
                    canceledBy: cancellerName,
                    cancelReason: reason,
                  }
                : vacation,
            ),
          );
        } else {
          // Call API to cancel vacation
          const updatedVacation = await api.cancelVacation(
            id,
            cancellerName,
            reason,
          );
          setVacations((prev) =>
            prev.map((vacation) =>
              vacation.id === id ? updatedVacation : vacation,
            ),
          );
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to cancel vacation",
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [useMockData],
  );

  // Helper functions that use either mock data or API calls
  const getVacationsByStatus = useCallback(
    (status) => {
      if (useMockData) {
        return mockGetVacationsByStatus(status);
      }
      return vacations.filter((vacation) => vacation.status === status);
    },
    [vacations, useMockData],
  );

  const getVacationsByEmployee = useCallback(
    (employeeId) => {
      if (useMockData) {
        return mockGetVacationsByEmployee(employeeId);
      }
      return vacations.filter((vacation) => vacation.employeeId === employeeId);
    },
    [vacations, useMockData],
  );

  const getVacationsInDateRange = useCallback(
    (startDate, endDate) => {
      if (useMockData) {
        return mockGetVacationsInDateRange(startDate, endDate);
      }
      return vacations.filter(
        (vacation) =>
          (vacation.startDate >= startDate && vacation.startDate <= endDate) ||
          (vacation.endDate >= startDate && vacation.endDate <= endDate) ||
          (vacation.startDate <= startDate && vacation.endDate >= endDate),
      );
    },
    [vacations, useMockData],
  );

  const getVacationsForDate = useCallback(
    (date) => {
      if (useMockData) {
        return mockGetVacationsForDate(date);
      }
      const d = new Date(date).setHours(0, 0, 0, 0);
      return vacations.filter(
        (vacation) =>
          d >= new Date(vacation.startDate).setHours(0, 0, 0, 0) &&
          d <= new Date(vacation.endDate).setHours(0, 0, 0, 0),
      );
    },
    [vacations, useMockData],
  );

  const checkVacationOverlap = useCallback(
    (employeeId, startDate, endDate, excludeVacationId) => {
      if (useMockData) {
        return mockCheckVacationOverlap(
          employeeId,
          startDate,
          endDate,
          excludeVacationId,
        );
      }

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
          (newStartTime >= existingStartTime &&
            newStartTime <= existingEndTime) ||
          (newEndTime >= existingStartTime && newEndTime <= existingEndTime) ||
          (newStartTime <= existingStartTime && newEndTime >= existingEndTime)
        );
      });
    },
    [vacations, useMockData],
  );

  const calculateVacationDays = useCallback(
    (startDate, endDate) => {
      if (useMockData) {
        return mockCalculateVacationDays(startDate, endDate);
      }

      const start = new Date(startDate);
      const end = new Date(endDate);

      // Set time to midnight to avoid time zone issues
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      // Calculate the difference in days
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days

      return diffDays;
    },
    [useMockData],
  );

  const getUpcomingVacations = useCallback(() => {
    if (useMockData) {
      return mockGetUpcomingVacations();
    }

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
  }, [vacations, useMockData]);

  // Provide the context value
  const contextValue = {
    vacations,
    employees,
    loading,
    error,
    selectedDate,
    selectedMonth,
    selectedYear,
    viewMode,
    addVacation,
    updateVacation,
    approveVacation,
    rejectVacation,
    cancelVacation,
    setSelectedDate,
    setSelectedMonth,
    setSelectedYear,
    setViewMode,
    getVacationsByStatus,
    getVacationsByEmployee,
    getVacationsInDateRange,
    getVacationsForDate,
    checkVacationOverlap,
    calculateVacationDays,
    getUpcomingVacations,
    refreshVacations,
  };

  return (
    <VacationContext.Provider value={contextValue}>
      {children}
    </VacationContext.Provider>
  );
};

export default VacationContext;
