import { useState, useEffect, useCallback } from "react";
import axiosInstance from "services/axios";

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("flow/tasks");
      setTasks(response.data);
      setError(null);
    } catch (err) {
      setError("Erro ao carregar usuários");
      console.error("Erro ao buscar usuários:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
  };
}
