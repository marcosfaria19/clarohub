import { useState, useEffect, useCallback } from "react";
import axiosInstance from "services/axios";

export function useUsers(assignmentId = null) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Busca usuários, com ou sem assignmentId
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);

      const endpoint = assignmentId
        ? `/flow/assignments/${assignmentId}/users/`
        : "/users";

      const response = await axiosInstance.get(endpoint);
      setUsers(response.data);
      setError(null);
    } catch (err) {
      setError("Erro ao carregar usuários");
      console.error("Erro ao buscar usuários:", err);
    } finally {
      setLoading(false);
    }
  }, [assignmentId]);

  const fetchUserAssignments = useCallback(async (userId) => {
    if (!userId) return [];
    try {
      const response = await axiosInstance.get(
        `/flow/user/${userId}/assignments`,
      );
      return response.data;
    } catch (err) {
      console.error("Erro ao buscar assignments para o usuário", userId, err);
      return [];
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

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    fetchUsers,
    fetchUserAssignments,
    getUsersByProjectId,
    getProjectDetails,
  };
}
