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
    } catch (err) {
      setError("Erro ao carregar usuários");
      console.error("Erro ao buscar usuários:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const getUsersByProjectId = useCallback(
    (projectId) => {
      return users.filter(
        (user) => user.project && user.project._id === projectId,
      );
    },
    [users],
  );

  const getUserProjectId = useCallback(
    (userId) => {
      const user = users.find((user) => user._id === userId);
      return user?.project?._id || null;
    },
    [users],
  );

  const getUsersByProjectAndAssignment = useCallback(
    (projectId, assignmentId) => {
      return users.filter(
        (user) =>
          user.project?._id === projectId &&
          user.assignments?.some(
            (assignment) => assignment._id === assignmentId,
          ),
      );
    },
    [users],
  );

  const fetchUserAssignments = useCallback(async (userId) => {
    try {
      const response = await axiosInstance.get(`/users/${userId}/assignments`);
      return response.data.assignments || [];
    } catch (err) {
      setError("Erro ao carregar demandas");
      return [];
    }
  }, []);

  return {
    users,
    loading,
    error,
    getUsersByProjectId,
    getUserProjectId,
    fetchUserAssignments,
    getUsersByProjectAndAssignment,
  };
}
