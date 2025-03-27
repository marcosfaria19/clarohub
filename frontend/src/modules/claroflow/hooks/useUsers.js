import { useState, useEffect, useCallback } from "react";
import axiosInstance from "services/axios";

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/users");
      setUsers(response.data);
      setError(null);
    } catch (err) {
      setError("Erro ao carregar usuários");
      console.error("Erro ao buscar usuários:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserAssignments = useCallback(async (userId) => {
    if (!userId) return [];
    try {
      const response = await axiosInstance.get(
        `/flow/user/${userId}/assignments`,
      );
      return response.data;
    } catch (err) {
      return [];
    }
  }, []);

  const getUsersByProjectId = useCallback(
    (projectId) => users.filter((user) => user.project?._id === projectId),
    [users],
  );

  const getUsersByProjectAndAssignment = useCallback(
    (projectId, assignmentId) =>
      users.filter(
        (user) =>
          user.project?._id === projectId &&
          user.assignments?.some((a) => a._id === assignmentId),
      ),
    [users],
  );

  const getProjectDetails = useCallback(
    (userId) => users.find((user) => user._id === userId)?.project || null,
    [users],
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    fetchUsers,
    getUsersByProjectId,
    getProjectDetails,
    fetchUserAssignments,
    getUsersByProjectAndAssignment,
  };
}
