// hooks/useTasks.js
import { useState, useEffect, useCallback } from "react";
import axiosInstance from "services/axios";

export const useTasks = ({
  assignmentId,
  userId,
  flowType = "default",
} = {}) => {
  const [availableTasks, setAvailableTasks] = useState([]);
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);

  const [loadingAvailable, setLoadingAvailable] = useState(false);
  const [loadingInProgress, setLoadingInProgress] = useState(false);
  const [loadingCompleted, setLoadingCompleted] = useState(false);

  const [error, setError] = useState(null);

  const fetchAvailableTasks = useCallback(async () => {
    if (!assignmentId) return;

    setLoadingAvailable(true);
    try {
      const response = await axiosInstance.get(
        `/flow/tasks/assignment/${assignmentId}`,
      );
      setAvailableTasks(response.data.filter((t) => !t.assignedTo));
      setError(null);
    } catch (err) {
      setError(err.response?.data || err.message);
      console.error("Erro ao buscar tarefas disponíveis:", err);
    } finally {
      setLoadingAvailable(false);
    }
  }, [assignmentId]);

  const fetchInProgressTasks = useCallback(async () => {
    if (!assignmentId) return;

    setLoadingInProgress(true);
    try {
      let url;

      // Fluxo compartilhado: busca todas as tasks sem filtrar por usuário
      if (flowType === "shared") {
        url = `/flow/tasks/assignment/${assignmentId}/in-progress`;
      }
      // Fluxo padrão: busca apenas tasks do usuário
      else {
        if (!userId) return;
        url = `/flow/tasks/assignment/${assignmentId}/user/${userId}`;
      }

      const response = await axiosInstance.get(url);
      setInProgressTasks(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data || err.message);
      console.error("Erro ao buscar tarefas em progresso:", err);
    } finally {
      setLoadingInProgress(false);
    }
  }, [assignmentId, userId, flowType]);

  const fetchCompletedTasks = useCallback(async () => {
    if (!assignmentId || !userId) return;

    setLoadingCompleted(true);
    try {
      const response = await axiosInstance.get(
        `/flow/tasks/completed/${assignmentId}/user/${userId}`,
      );
      setCompletedTasks(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data || err.message);
      console.error("Erro ao buscar tarefas finalizadas:", err);
    } finally {
      setLoadingCompleted(false);
    }
  }, [assignmentId, userId]);

  const takeTask = useCallback(
    async (taskId) => {
      try {
        const response = await axiosInstance.patch(
          `/flow/tasks/take/${taskId}`,
        );
        await fetchAvailableTasks();
        return response.data;
      } catch (err) {
        setError(err.response?.data || err.message);
        throw err;
      }
    },
    [fetchAvailableTasks],
  );

  const transitionTask = useCallback(
    async (taskId, newStatusId, projectId) => {
      try {
        await axiosInstance.patch(`/flow/tasks/transition/${taskId}`, {
          newStatusId,
          projectId,
          obs: "Status alterado pelo usuário",
        });
        await Promise.all([fetchInProgressTasks(), fetchCompletedTasks()]);
        return true;
      } catch (err) {
        console.error("Erro na transição:", err);
        return false;
      }
    },
    [fetchInProgressTasks, fetchCompletedTasks],
  );

  useEffect(() => {
    if (assignmentId) {
      fetchAvailableTasks();
    }
  }, [assignmentId, fetchAvailableTasks]);

  useEffect(() => {
    if (assignmentId) {
      fetchInProgressTasks();
      if (userId) {
        fetchCompletedTasks();
      }
    }
  }, [assignmentId, userId, fetchInProgressTasks, fetchCompletedTasks]);

  return {
    availableTasks,
    inProgressTasks,
    completedTasks,
    loadingAvailable,
    loadingInProgress,
    loadingCompleted,
    error,
    takeTask,
    transitionTask,
    refetchAvailableTasks: fetchAvailableTasks,
    refetchInProgressTasks: fetchInProgressTasks,
    refetchCompletedTasks: fetchCompletedTasks,
    flowType,
  };
};
