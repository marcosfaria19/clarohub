import { useState, useEffect } from "react";
import axiosInstance from "services/axios";

export const useTasks = (assignmentId) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/flow/tasks/assignment/${assignmentId}`,
      );
      setTasks(response.data);
      setError(null);
    } catch (err) {
      console.error("Erro ao buscar tasks:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (assignmentId) {
      fetchTasks();
    }
  }, [assignmentId]);

  return { tasks, loading, error, refetch: fetchTasks };
};
