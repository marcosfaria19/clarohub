// useUsers.js
// Hook responsável por buscar e manipular dados dos usuários.
import { useState, useEffect, useCallback } from "react";
import axiosInstance from "services/axios";

export function useUsers() {
  // Estados para armazenar usuários, loading e erros
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função para buscar todos os usuários
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

  // Função para buscar as assignments de um usuário específico
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

  // Função que filtra os usuários com base no ID do projeto
  const getUsersByProjectId = useCallback(
    (projectId) => users.filter((user) => user.project?._id === projectId),
    [users],
  );

  // Função que filtra usuários pelo projeto e assignment específico
  const getUsersByProjectAndAssignment = useCallback(
    (projectId, assignmentId) =>
      users.filter(
        (user) =>
          user.project?._id === projectId &&
          user.assignments?.some((a) => a._id === assignmentId),
      ),
    [users],
  );

  // Função para obter detalhes do projeto associado a um usuário
  const getProjectDetails = useCallback(
    (userId) => users.find((user) => user._id === userId)?.project || null,
    [users],
  );

  // Carrega os usuários assim que o hook é montado
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
