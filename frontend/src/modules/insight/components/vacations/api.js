// Base API URL - would be replaced with actual API URL in production
const API_BASE_URL = "https://api.example.com";

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "An error occurred");
  }
  return response.json();
};

// Get all employees
export const getEmployees = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/employees`);
    return handleResponse(response);
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};

// Get employee by ID
export const getEmployeeById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`);
    return handleResponse(response);
  } catch (error) {
    console.error(`Error fetching employee with ID ${id}:`, error);
    throw error;
  }
};

// Get all vacations
export const getVacations = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/vacations`);
    return handleResponse(response);
  } catch (error) {
    console.error("Error fetching vacations:", error);
    throw error;
  }
};

// Get vacation by ID
export const getVacationById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/vacations/${id}`);
    return handleResponse(response);
  } catch (error) {
    console.error(`Error fetching vacation with ID ${id}:`, error);
    throw error;
  }
};

// Get vacations by employee ID
export const getVacationsByEmployeeId = async (employeeId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/employees/${employeeId}/vacations`,
    );
    return handleResponse(response);
  } catch (error) {
    console.error(
      `Error fetching vacations for employee with ID ${employeeId}:`,
      error,
    );
    throw error;
  }
};

// Get vacations by status
export const getVacationsByStatus = async (status) => {
  try {
    const response = await fetch(`${API_BASE_URL}/vacations?status=${status}`);
    return handleResponse(response);
  } catch (error) {
    console.error(`Error fetching vacations with status ${status}:`, error);
    throw error;
  }
};

// Create a new vacation request
export const createVacation = async (vacationData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/vacations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(vacationData),
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Error creating vacation:", error);
    throw error;
  }
};

// Update a vacation
export const updateVacation = async (id, updates) => {
  try {
    const response = await fetch(`${API_BASE_URL}/vacations/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });
    return handleResponse(response);
  } catch (error) {
    console.error(`Error updating vacation with ID ${id}:`, error);
    throw error;
  }
};

// Approve a vacation
export const approveVacation = async (id, approverName) => {
  try {
    const response = await fetch(`${API_BASE_URL}/vacations/${id}/approve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ approverName }),
    });
    return handleResponse(response);
  } catch (error) {
    console.error(`Error approving vacation with ID ${id}:`, error);
    throw error;
  }
};

// Reject a vacation
export const rejectVacation = async (id, rejectorName, reason) => {
  try {
    const response = await fetch(`${API_BASE_URL}/vacations/${id}/reject`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rejectorName, reason }),
    });
    return handleResponse(response);
  } catch (error) {
    console.error(`Error rejecting vacation with ID ${id}:`, error);
    throw error;
  }
};

// Cancel a vacation
export const cancelVacation = async (id, cancellerName, reason) => {
  try {
    const response = await fetch(`${API_BASE_URL}/vacations/${id}/cancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cancellerName, reason }),
    });
    return handleResponse(response);
  } catch (error) {
    console.error(`Error canceling vacation with ID ${id}:`, error);
    throw error;
  }
};

// Check for vacation overlaps
export const checkVacationOverlap = async (
  employeeId,
  startDate,
  endDate,
  excludeVacationId,
) => {
  try {
    const url = new URL(`${API_BASE_URL}/vacations/check-overlap`);
    url.searchParams.append("employeeId", employeeId.toString());
    url.searchParams.append("startDate", startDate.toISOString());
    url.searchParams.append("endDate", endDate.toISOString());
    if (excludeVacationId) {
      url.searchParams.append(
        "excludeVacationId",
        excludeVacationId.toString(),
      );
    }

    const response = await fetch(url.toString());
    const data = await handleResponse(response);
    return data.overlaps;
  } catch (error) {
    console.error("Error checking vacation overlap:", error);
    throw error;
  }
};

// Get upcoming vacations (next 60 days)
export const getUpcomingVacations = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/vacations/upcoming`);
    return handleResponse(response);
  } catch (error) {
    console.error("Error fetching upcoming vacations:", error);
    throw error;
  }
};

// Get employee vacation balance
export const getEmployeeVacationBalance = async (employeeId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/employees/${employeeId}/vacation-balance`,
    );
    return handleResponse(response);
  } catch (error) {
    console.error(
      `Error fetching vacation balance for employee with ID ${employeeId}:`,
      error,
    );
    throw error;
  }
};
