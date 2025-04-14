// hooks/useTasks.js
import { useState, useEffect } from "react";
import axiosInstance from "services/axios";

export const useTasks = ({ assignmentId, userId } = {}) => {
  const [availableTasks, setAvailableTasks] = useState([]);
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAvailableTasks = async () => {
    if (!assignmentId) return;

    setLoading(true);
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
      setLoading(false);
    }
  };

  const fetchInProgressTasks = async () => {
    if (!assignmentId || !userId) return;

    setLoading(true);
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
      setLoading(false);
    }
  };

  const fetchCompletedTasks = async () => {
    if (!assignmentId || !userId) return;

    setLoading(true);
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
      setLoading(false);
    }
  };

  const takeTask = async (taskId) => {
    setLoading(true);
    try {
      const response = await axiosInstance.patch(`/flow/tasks/take/${taskId}`);
      await fetchAvailableTasks();
      return response.data;
    } catch (err) {
      setError(err.response?.data || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const transitionTask = async (taskId, newStatusId, projectId) => {
    setLoading(true);
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
    } finally {
      setLoading(false);
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
    loading,
    error,
    takeTask,
    transitionTask,
    refetchAvailableTasks: fetchAvailableTasks,
    refetchInProgressTasks: fetchInProgressTasks,
    refetchCompletedTasks: fetchCompletedTasks,
  };
};
