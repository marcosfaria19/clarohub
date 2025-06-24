import useSWR from "swr";
import { useCallback } from "react";
import axiosInstance from "services/axios";

// Fetcher function for SWR
const fetcher = async (url) => {
  const response = await axiosInstance.get(url);
  return response.data;
};

export function useVacations() {
  // Use SWR for data fetching with automatic revalidation
  const {
    data: vacations = [],
    error,
    isLoading: loading,
    isValidating,
    mutate,
  } = useSWR("/vacations", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 5000,
    errorRetryCount: 3,
    errorRetryInterval: 1000,
  });

  // Invalidate cache function
  const invalidateVacationsCache = useCallback(async () => {
    await mutate();
  }, [mutate]);

  const fetchUserVacations = useCallback(async (userId) => {
    if (!userId) return [];
    try {
      const response = await axiosInstance.get(`/vacations/user/${userId}`);
      return response.data || [];
    } catch (err) {
      console.error(`Erro ao buscar férias do usuário ${userId}:`, err);
      throw new Error(`Erro ao buscar férias do usuário`);
    }
  }, []);

  const scheduleVacation = useCallback(
    async (vacationData) => {
      try {
        const response = await axiosInstance.post("/vacations", vacationData);
        // Revalidate cache after successful creation
        await mutate();
        return response.data;
      } catch (err) {
        console.error("Erro ao agendar férias:", err);
        throw new Error("Erro ao agendar férias");
      }
    },
    [mutate],
  );

  const updateVacation = useCallback(
    async (vacationId, vacationData) => {
      try {
        const response = await axiosInstance.put(
          `/vacations/${vacationId}`,
          vacationData,
        );
        // Optimistic update
        await mutate(
          (currentData) =>
            currentData?.map((vacation) =>
              vacation._id === vacationId ? response.data : vacation,
            ) || [],
          false,
        );
        // Revalidate to ensure consistency
        await mutate();
        return response.data;
      } catch (err) {
        console.error(`Erro ao atualizar férias ${vacationId}:`, err);
        // Revalidate on error to restore correct state
        await mutate();
        throw new Error("Erro ao atualizar férias");
      }
    },
    [mutate],
  );

  const deleteVacation = useCallback(
    async (vacationId) => {
      try {
        await axiosInstance.delete(`/vacations/${vacationId}`);
        // Optimistic update
        await mutate(
          (currentData) =>
            currentData?.filter((vacation) => vacation._id !== vacationId) ||
            [],
          false,
        );
        // Revalidate to ensure consistency
        await mutate();
        return true;
      } catch (err) {
        console.error(`Erro ao excluir férias ${vacationId}:`, err);
        // Revalidate on error to restore correct state
        await mutate();
        throw new Error("Erro ao excluir férias");
      }
    },
    [mutate],
  );

  const checkVacationOverlap = useCallback(
    async (userId, startDate, endDate, excludeVacationId = null) => {
      try {
        const response = await axiosInstance.post(`/vacations/check-overlap`, {
          userId,
          startDate,
          endDate,
          excludeVacationId,
        });
        return response.data;
      } catch (err) {
        console.error("Erro ao verificar sobreposição de férias:", err);
        throw new Error("Erro ao verificar sobreposição de férias");
      }
    },
    [],
  );

  return {
    vacations: Array.isArray(vacations) ? vacations : [],
    loading,
    error: error?.message || null,
    isValidating,
    invalidateVacationsCache,
    fetchUserVacations,
    scheduleVacation,
    updateVacation,
    deleteVacation,
    checkVacationOverlap,
  };
}
