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

  const getUsersByProjectId = useCallback(
    (projectId) => users.filter((user) => user.project?._id === projectId),
    [users],
  );

  const getProjectDetails = useCallback(
    (userId) => users.find((user) => user._id === userId)?.project || null,
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
  };
}
