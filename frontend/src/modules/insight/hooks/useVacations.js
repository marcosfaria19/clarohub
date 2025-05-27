import { useState, useCallback, useEffect } from "react";
import axiosInstance from "services/axios";

export function useVacations() {
  const [vacations, setVacations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Buscar todas as férias
  const fetchVacations = useCallback(async (userId = null) => {
    setLoading(true);
    try {
      /* const endpoint = userId ? `/vacations/user/${userId}` : "/vacations";
      const response = await axiosInstance.get(endpoint); */
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

  // Buscar férias de um usuário específico
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

  // Agendar novas férias
  const scheduleVacation = useCallback(async (vacationData) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/vacations", vacationData);
      setVacations((prev) => [...prev, response.data]);
      setError(null);
      return response.data;
    } catch (err) {
      console.error("Erro ao agendar férias:", err);
      setError("Erro ao agendar férias");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Atualizar férias existentes
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

  // Excluir férias
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

  // Aprovar férias
  const approveVacation = useCallback(async (vacationId) => {
    setLoading(true);
    try {
      const response = await axiosInstance.patch(
        `/vacations/${vacationId}/approve`,
      );
      setVacations((prev) =>
        prev.map((vacation) =>
          vacation._id === vacationId ? response.data : vacation,
        ),
      );
      setError(null);
      return response.data;
    } catch (err) {
      console.error(`Erro ao aprovar férias ${vacationId}:`, err);
      setError("Erro ao aprovar férias");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Rejeitar férias
  const rejectVacation = useCallback(async (vacationId, reason) => {
    setLoading(true);
    try {
      const response = await axiosInstance.patch(
        `/vacations/${vacationId}/reject`,
        { reason },
      );
      setVacations((prev) =>
        prev.map((vacation) =>
          vacation._id === vacationId ? response.data : vacation,
        ),
      );
      setError(null);
      return response.data;
    } catch (err) {
      console.error(`Erro ao rejeitar férias ${vacationId}:`, err);
      setError("Erro ao rejeitar férias");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Verificar sobreposição de férias para um usuário
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

  // Obter estatísticas de férias (dias disponíveis, usados, etc.)
  const getVacationStats = useCallback(async (userId) => {
    try {
      const response = await axiosInstance.get(`/vacations/stats/${userId}`);
      return response.data;
    } catch (err) {
      console.error(
        `Erro ao obter estatísticas de férias para usuário ${userId}:`,
        err,
      );
      throw err;
    }
  }, []);

  // Carregar férias ao montar o componente
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
    approveVacation,
    rejectVacation,
    checkVacationOverlap,
    getVacationStats,
  };
}
