import { useState, useEffect, useCallback } from "react";
import axiosInstance from "services/axios";
import { useCache } from "modules/shared/contexts/CacheContext";
/**
 * Hook otimizado para gerenciamento de usuários com cache inteligente
 *
 * Mantém exatamente a mesma interface do hook original useUsers
 * Adiciona cache compartilhado com TTL de 2 horas
 */
export function useUsersOptimized(assignmentId = null) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cache = useCache();

  // Gera parâmetros para o cache baseado no assignmentId
  const getCacheParams = useCallback(() => {
    return assignmentId ? { assignmentId } : {};
  }, [assignmentId]);

  // Busca usuários, com ou sem assignmentId
  const fetchUsers = useCallback(
    async (forceRefresh = false) => {
      try {
        setLoading(true);
        setError(null);

        const cacheParams = getCacheParams();

        // Verifica cache primeiro (se não for refresh forçado)
        if (!forceRefresh) {
          const cachedData = cache.get("users", cacheParams);
          if (cachedData) {
            setUsers(cachedData);
            setLoading(false);
            return cachedData;
          }
        }

        // Busca da API
        const endpoint = assignmentId
          ? `/flow/assignments/${assignmentId}/users/`
          : "/users";

        const response = await axiosInstance.get(endpoint);
        const userData = response.data;

        // Armazena no cache
        cache.set("users", userData, cacheParams);

        setUsers(userData);
        setError(null);

        return userData;
      } catch (err) {
        const errorMessage = "Erro ao carregar usuários";
        setError(errorMessage);
        console.error("Erro ao buscar usuários:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [assignmentId, cache, getCacheParams],
  );

  // Busca assignments de um usuário específico
  const fetchUserAssignments = useCallback(
    async (userId) => {
      if (!userId) return [];

      try {
        // Cache específico para assignments do usuário
        const cacheParams = { userId };
        const cachedData = cache.get("userAssignments", cacheParams);

        if (cachedData) {
          return cachedData;
        }

        const response = await axiosInstance.get(
          `/flow/user/${userId}/assignments`,
        );

        const assignmentsData = response.data;

        // Cache com TTL menor para assignments (30 minutos)
        cache.set("userAssignments", assignmentsData, cacheParams);

        return assignmentsData;
      } catch (err) {
        console.error("Erro ao buscar assignments para o usuário", userId, err);
        return [];
      }
    },
    [cache],
  );

  // Filtra usuários por projeto (função pura, não precisa de cache)
  const getUsersByProjectId = useCallback(
    (projectId) => users.filter((user) => user.project?._id === projectId),
    [users],
  );

  // Carrega dados na montagem ou mudança de assignmentId
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
  };
}

// Mantém compatibilidade com export nomeado original
export { useUsersOptimized as useUsers };

export default useUsersOptimized;
