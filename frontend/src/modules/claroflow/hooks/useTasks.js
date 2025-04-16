// hooks/useTasks.js
import { useState, useEffect } from "react";
import axiosInstance from "services/axios";

export const useTasks = ({ assignmentId, userId } = {}) => {
  const [availableTasks, setAvailableTasks] = useState([]);
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);

  const [loadingAvailable, setLoadingAvailable] = useState(false);
  const [loadingInProgress, setLoadingInProgress] = useState(false);
  const [loadingCompleted, setLoadingCompleted] = useState(false);

  const [error, setError] = useState(null);

  const fetchAvailableTasks = async () => {
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
  };

  const fetchInProgressTasks = async () => {
    if (!assignmentId || !userId) return;

    setLoadingInProgress(true);
    try {
      const response = await axiosInstance.get(
        `/flow/tasks/assignment/${assignmentId}/user/${userId}`,
      );
      setInProgressTasks(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data || err.message);
      console.error("Erro ao buscar tarefas em progresso:", err);
    } finally {
      setLoadingInProgress(false);
    }
  };

  const fetchCompletedTasks = async () => {
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
  };

  const takeTask = async (taskId) => {
    try {
      const response = await axiosInstance.patch(`/flow/tasks/take/${taskId}`);
      await fetchAvailableTasks();
      return response.data;
    } catch (err) {
      setError(err.response?.data || err.message);
      throw err;
    }
  };

  const transitionTask = async (taskId, newStatusId, projectId) => {
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
  };

  useEffect(() => {
    if (assignmentId) {
      fetchAvailableTasks();
    }
  }, [assignmentId]);

  useEffect(() => {
    if (assignmentId && userId) {
      fetchInProgressTasks();
      fetchCompletedTasks();
    }
  }, [assignmentId, userId]);

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
  };
};
