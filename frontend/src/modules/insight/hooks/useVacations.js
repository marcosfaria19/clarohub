import { useState, useCallback, useEffect } from "react";
import axiosInstance from "services/axios";

export function useVacations() {
  const [vacations, setVacations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchVacations = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/vacations");
      setVacations(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      console.error("Erro ao buscar férias:", err);
      setError("Erro ao buscar férias");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserVacations = useCallback(async (userId) => {
    if (!userId) return [];
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/vacations/user/${userId}`);
      setError(null);
      return response.data;
    } catch (err) {
      console.error(`Erro ao buscar férias do usuário ${userId}:`, err);
      setError(`Erro ao buscar férias do usuário`);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const scheduleVacation = useCallback(
    async (vacationData) => {
      setLoading(true);
      try {
        const response = await axiosInstance.post("/vacations", vacationData);
        setError(null);
        // Atualiza a lista completa após inserir
        await fetchVacations();
        return response.data;
      } catch (err) {
        console.error("Erro ao agendar férias:", err);
        setError("Erro ao agendar férias");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchVacations],
  );

  const updateVacation = useCallback(async (vacationId, vacationData) => {
    setLoading(true);
    try {
      const response = await axiosInstance.put(
        `/vacations/${vacationId}`,
        vacationData,
      );
      setVacations((prev) =>
        prev.map((vacation) =>
          vacation._id === vacationId ? response.data : vacation,
        ),
      );
      setError(null);
      return response.data;
    } catch (err) {
      console.error(`Erro ao atualizar férias ${vacationId}:`, err);
      setError("Erro ao atualizar férias");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteVacation = useCallback(async (vacationId) => {
    setLoading(true);
    try {
      await axiosInstance.delete(`/vacations/${vacationId}`);
      setVacations((prev) =>
        prev.filter((vacation) => vacation._id !== vacationId),
      );
      setError(null);
      return true;
    } catch (err) {
      console.error(`Erro ao excluir férias ${vacationId}:`, err);
      setError("Erro ao excluir férias");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

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
        throw err;
      }
    },
    [],
  );

  useEffect(() => {
    fetchVacations();
  }, [fetchVacations]);

  return {
    vacations,
    loading,
    error,
    fetchVacations,
    fetchUserVacations,
    scheduleVacation,
    updateVacation,
    deleteVacation,
    checkVacationOverlap,
  };
}
