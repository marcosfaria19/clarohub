import { useState, useEffect } from "react";
import axiosInstance from "services/axios";

export const useUserAssignments = () => {
  const [project, setProject] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserAssignments = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axiosInstance.get("/user/assignments");
        const { project, assignments } = response.data;
        setProject(project);
        setAssignments(assignments);
      } catch (err) {
        setError("Erro ao carregar dados do usuário");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAssignments();
  }, []);

  return { project, assignments, loading, error };
};
