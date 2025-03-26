import { useState, useEffect, useCallback } from "react";
import axiosInstance from "services/axios";

const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Tipos de projetos
  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/flow/projects");
      setProjects(response.data);
    } catch (err) {
      console.error("Erro ao buscar projetos:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Demandas de um projeto específico
  const fetchAssignments = useCallback(
    async (projectId) => {
      try {
        if (!projectId) {
          console.warn("ID do projeto não fornecido para buscar assignments");
          return [];
        }

        setLoading(true);

        // Primeiro verifica se os projetos já foram carregados
        if (projects.length === 0) {
          await fetchProjects(); // Força o carregamento se necessário
        }

        const project = projects.find((p) => p._id === projectId);

        if (!project) {
          return [];
        }

        return project.assignments || [];
      } catch (err) {
        console.error("Erro ao buscar assignments:", err);
        setError(err);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [projects, fetchProjects],
  );

  // Criar nova demanda em um projeto
  const createAssignment = async (projectId, assignment) => {
    if (!projectId) {
      console.error("ID do projeto não fornecido");
      setError(new Error("ID do projeto não fornecido"));
      return;
    }
    try {
      setLoading(true);
      const response = await axiosInstance.post(
        `/flow/projects/${projectId}/assignments`,
        { name: assignment },
      );

      // Atualizar estado local com a nova demanda
      setProjects((prev) =>
        prev.map((project) =>
          project._id === projectId
            ? {
                ...project,
                assignments: [...project.assignments, response.data],
              }
            : project,
        ),
      );
    } catch (err) {
      console.error("Erro ao criar assignment:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Função para editar uma demanda
  const editAssignment = async (projectId, assignmentId, newName) => {
    if (!projectId || !assignmentId) {
      console.error("ID do projeto ou da demanda não fornecido");
      setError(new Error("ID do projeto ou da demanda não fornecido"));
      return;
    }
    try {
      setLoading(true);
      await axiosInstance.patch(
        `/flow/projects/${projectId}/assignments/${assignmentId}`,
        {
          name: newName,
        },
      );

      // Atualizar o estado local com o novo nome
      setProjects((prev) =>
        prev.map((project) =>
          project._id === projectId
            ? {
                ...project,
                assignments: project.assignments.map((assignment) =>
                  assignment._id === assignmentId
                    ? { ...assignment, name: newName }
                    : assignment,
                ),
              }
            : project,
        ),
      );
    } catch (err) {
      console.error(
        "Erro ao editar assignment:",
        err.response?.data || err.message,
      );
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Função para excluir uma demanda
  const deleteAssignment = async (projectId, assignmentId) => {
    try {
      setLoading(true);
      await axiosInstance.delete(
        `/flow/projects/${projectId}/assignments/${assignmentId}`,
      );

      // Atualizar o estado local para remover o assignment
      setProjects((prev) =>
        prev.map((project) =>
          project._id === projectId
            ? {
                ...project,
                assignments: project.assignments.filter(
                  (assignment) => assignment._id !== assignmentId,
                ),
              }
            : project,
        ),
      );
    } catch (err) {
      console.error("Erro ao excluir assignment:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const assignUsers = async (projectId, assignments) => {
    try {
      setLoading(true);
      const response = await axiosInstance.patch(
        `/flow/projects/${projectId}/assign-users`,
        { assignments },
      );

      // Atualiza o estado local
      setProjects((prev) =>
        prev.map((p) =>
          p._id === projectId
            ? {
                ...p,
                assignments: p.assignments.map((a) => {
                  const updated = assignments.find((u) => u.id === a._id);
                  return updated
                    ? { ...a, assignedUsers: updated.assignedUsers }
                    : a;
                }),
              }
            : p,
        ),
      );

      return response.data;
    } catch (err) {
      console.error("Erro ao atualizar assignments:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Hook para buscar projetos ao carregar
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    error,
    loading,
    fetchProjects,
    fetchAssignments,
    createAssignment,
    editAssignment,
    deleteAssignment,
    assignUsers,
  };
};

export default useProjects;
