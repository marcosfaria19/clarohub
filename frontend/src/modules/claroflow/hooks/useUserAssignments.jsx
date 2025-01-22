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

  // Função para adicionar o usuário à demanda
  const assignUserToAssignment = async (projectId, assignmentId) => {
    try {
      setLoading(true);
      const response = await axiosInstance.patch(
        `/flow/projects/${projectId}/assignments/${assignmentId}/assign-user`,
        { userId },
      );

      // Atualizar o estado local, adicionando o usuário à demanda
      setAssignments((prevAssignments) =>
        prevAssignments.map((assignment) =>
          assignment._id === assignmentId
            ? {
                ...assignment,
                assignedUsers: [...assignment.assignedUsers, userId],
              }
            : assignment,
        ),
      );

      return response.data;
    } catch (err) {
      console.error("Erro ao adicionar usuário à demanda:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { project, assignments, loading, error, assignUserToAssignment };
};
