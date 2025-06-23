import { useMemo, useCallback } from "react";
import axiosInstance from "services/axios";
import { SWR_KEYS } from "services/swrConfig";
import useSWR, { mutate } from "swr";

export function useUsers(assignmentId = null) {
  // Determina a key e endpoint baseado no assignmentId
  const swrKey = assignmentId
    ? SWR_KEYS.USERS_BY_ASSIGNMENT(assignmentId)
    : SWR_KEYS.USERS;

  // Hook principal do SWR para buscar usuários
  const {
    data: users = [],
    error,
    isLoading: loading,
    mutate: mutateUsers,
    isValidating,
  } = useSWR(swrKey, {
    // Configurações específicas para este hook
    revalidateOnFocus: false, // Evita revalidação excessiva ao focar na janela
    dedupingInterval: 30000, // 30 segundos de cache
    refreshInterval: 0, // Desabilita refresh automático para usuários
  });

  // Função para revalidar os dados manualmente
  const fetchUsers = useCallback(async () => {
    try {
      await mutateUsers();
      return true;
    } catch (err) {
      console.error("Erro ao revalidar usuários:", err);
      return false;
    }
  }, [mutateUsers]);

  // Função corrigida sem tentar ler cache manualmente
  const fetchUserAssignments = useCallback(async (userId) => {
    if (!userId) return [];

    try {
      const response = await axiosInstance.get(
        `/flow/user/${userId}/assignments`,
      );

      // Atualiza o cache com os novos dados
      const key = SWR_KEYS.USER_ASSIGNMENTS(userId);
      mutate(key, response.data, { revalidate: false });

      return response.data;
    } catch (err) {
      console.error("Erro ao buscar assignments para o usuário", userId, err);
      return [];
    }
  }, []);

  // Função memoizada para filtrar usuários por projeto
  const getUsersByProjectId = useCallback(
    (projectId) => {
      if (!users || !Array.isArray(users)) return [];
      return users.filter((user) => user.project?._id === projectId);
    },
    [users],
  );

  // Função para invalidar cache relacionado a usuários
  const invalidateUsersCache = useCallback(() => {
    // Invalida cache de usuários gerais
    mutate(SWR_KEYS.USERS);

    // Invalida cache de usuários por assignment se aplicável
    if (assignmentId) {
      mutate(SWR_KEYS.USERS_BY_ASSIGNMENT(assignmentId));
    }

    // Invalida cache de managers
    mutate(SWR_KEYS.MANAGERS);
  }, [assignmentId]);

  // Função para adicionar usuário ao cache local (optimistic update)
  const addUserToCache = useCallback(
    (newUser) => {
      mutateUsers(
        (currentUsers) => {
          if (!currentUsers) return [newUser];
          return [...currentUsers, newUser];
        },
        { revalidate: false },
      );
    },
    [mutateUsers],
  );

  // Função para atualizar usuário no cache local
  const updateUserInCache = useCallback(
    (userId, updatedData) => {
      mutateUsers(
        (currentUsers) => {
          if (!currentUsers) return currentUsers;
          return currentUsers.map((user) =>
            user._id === userId ? { ...user, ...updatedData } : user,
          );
        },
        { revalidate: false },
      );
    },
    [mutateUsers],
  );

  // Função para remover usuário do cache local
  const removeUserFromCache = useCallback(
    (userId) => {
      mutateUsers(
        (currentUsers) => {
          if (!currentUsers) return currentUsers;
          return currentUsers.filter((user) => user._id !== userId);
        },
        { revalidate: false },
      );
    },
    [mutateUsers],
  );

  // Estado de erro formatado
  const formattedError = useMemo(() => {
    if (!error) return null;

    if (error.response?.status === 401) {
      return "Sessão expirada. Faça login novamente.";
    }

    if (error.response?.status === 403) {
      return "Você não tem permissão para acessar estes dados.";
    }

    if (error.response?.status >= 500) {
      return "Erro interno do servidor. Tente novamente mais tarde.";
    }

    return "Erro ao carregar usuários";
  }, [error]);

  // Retorna a mesma interface do hook original para manter compatibilidade
  return {
    users,
    loading,
    error: formattedError,
    isValidating, // Estado adicional do SWR
    fetchUsers,
    fetchUserAssignments,
    getUsersByProjectId,
    // Funções adicionais para gerenciamento de cache
    invalidateUsersCache,
    addUserToCache,
    updateUserInCache,
    removeUserFromCache,
    mutateUsers, // Expõe o mutate para casos específicos
  };
}

// Hook especializado para managers
export function useManagers() {
  const {
    data: managers = [],
    error,
    isLoading: loading,
    mutate: mutateManagers,
  } = useSWR(SWR_KEYS.MANAGERS, {
    dedupingInterval: 60000, // 1 minuto de cache para managers
    revalidateOnFocus: false,
  });

  return {
    managers,
    loading,
    error: error ? "Erro ao carregar gestores" : null,
    refetch: mutateManagers,
  };
}

// Hook para stats de usuário específico
export function useUserStats(userId) {
  const {
    data: stats,
    error,
    isLoading: loading,
    mutate: mutateStats,
  } = useSWR(userId ? SWR_KEYS.USER_STATS(userId) : null, {
    refreshInterval: 30000, // Atualiza stats a cada 30 segundos
    revalidateOnFocus: true,
  });

  return {
    stats,
    loading,
    error: error ? "Erro ao carregar estatísticas do usuário" : null,
    refetch: mutateStats,
  };
}

// Hook para avatar de usuário específico
export function useUserAvatar(userId) {
  const {
    data: avatarData,
    error,
    isLoading: loading,
    mutate: mutateAvatar,
  } = useSWR(userId ? SWR_KEYS.USER_AVATAR(userId) : null, {
    dedupingInterval: 360000, // 1 hora de cache para avatares
    revalidateOnFocus: false,
  });

  return {
    avatar: avatarData?.avatar,
    loading,
    error: error ? "Erro ao carregar avatar" : null,
    refetch: mutateAvatar,
  };
}
