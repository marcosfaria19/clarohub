import { useState, useEffect } from "react";
import axiosInstance from "services/axios";

// Hook para gerenciar tarefas disponíveis para tratamento

export const useAvailableTasks = (assignmentId) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/flow/tasks/assignment/${assignmentId}`,
      );

      setTasks(response.data.filter((t) => !t.assignedTo));
      /* setTasks(response.data); */
      setError(null);
    } catch (err) {
      setError(err.response?.data || err.message);
      console.error("Erro ao buscar tarefas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (assignmentId) fetchTasks();
  }, [assignmentId]);

  return { tasks, loading, error, refetch: fetchTasks };
};

// Hook para buscar tarefas em tratamento por usuário

export const useInProgressTasks = (assignmentId, userId) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/flow/tasks/assignment/${assignmentId}/user/${userId}`,
      );
      setTasks(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (assignmentId && userId) fetchTasks();
  }, [assignmentId, userId]);

  return { tasks, loading, error, refetch: fetchTasks };
};

// Hook para buscar tarefas finalizadas por usuário

export const useCompletedTasks = (assignmentId, userId) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/flow/tasks/completed/${assignmentId}/user/${userId}`,
      );
      setTasks(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (assignmentId && userId) fetchTasks();
  }, [assignmentId, userId]);

  return { tasks, loading, error, refetch: fetchTasks };
};

// Hook para assumir uma tarefa

export const useTakeTask = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const takeTask = async (assignmentId) => {
    setLoading(true);
    try {
      const response = await axiosInstance.patch(
        `/flow/tasks/take/${assignmentId}`,
      );
      return response.data;
    } catch (err) {
      setError(err.response?.data || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { takeTask, loading, error };
};
