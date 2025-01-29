import { useState, useEffect } from "react";
import axiosInstance from "services/axios";

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/users");
        setUsers(response.data);
        setError(null);
      } catch (err) {
        setError("Erro ao carregar usuários");
        console.error("Erro ao buscar usuários:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const getUsersByProjectId = (projectId) => {
    return users.filter(
      (user) => user.project && user.project._id === projectId,
    );
  };

  const getUserProjectId = (userId) => {
    const user = users.find((user) => user._id === userId);
    return user?.project?._id || null; // Retorna o ID ou null se não existir
  };

  return { users, loading, error, getUsersByProjectId, getUserProjectId };
}
