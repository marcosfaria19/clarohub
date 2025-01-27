import { useState, useEffect } from "react";
import axiosInstance from "services/axios";

export const useUserAssignments = (userId) => {
  const [project, setProject] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setError("ID do usuário não fornecido");
      setLoading(false);
      return;
    }

    const fetchUserAssignments = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axiosInstance.get(
          `/users/${userId}/assignments`,
        );
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
  }, [userId]);

  // Função para atualizar as demandas
  const updateAssignments = async (assignmentsData) => {
    try {
      const response = await axiosInstance.patch(
        `/users/${userId}/assignments`,
        {
          assignments: assignmentsData,
        },
      );

      if (response.data.message === "Demanda alocada com sucesso") {
        setAssignments(assignmentsData); // Atualiza o estado com os novos assignments
      } else {
        setError("Erro ao alocar demanda");
      }
    } catch (error) {
      setError("Erro ao alocar demanda");
      console.error("Erro ao alocar demanda:", error);
    }
  };

  return { project, assignments, loading, error, updateAssignments };
};
