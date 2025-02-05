import { useState, useEffect, useCallback } from "react";
import axiosInstance from "services/axios";

const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Usar useCallback para memoizar a função fetchProjects
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

  // Função para buscar assignments de um projeto específico
  const fetchAssignments = async (projectId) => {
    try {
      setLoading(true);
      const project = projects.find((p) => p._id === projectId);
      if (!project) {
        throw new Error("Projeto não encontrado.");
      }

      return project.assignments;
    } catch (err) {
      console.error("Erro ao buscar assignments:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Função para criar um novo assignment em um projeto
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

  // Função para editar um assignment
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

  // Função para excluir um assignment
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

  // Função para reatribuir um usuário a múltiplas demandas
  const assignUserToAssignments = async (projectId, userId, assignmentIds) => {
    try {
      setLoading(true);

      const response = await axiosInstance.patch(
        `/flow/projects/${projectId}/assign-user`,
        { userId, assignmentIds }, // assignmentIds é um array
      );

      // Atualiza o estado local:
      setProjects((prev) =>
        prev.map((project) => {
          if (project._id !== projectId) return project;

          // Remove o usuário de todas as demandas
          const updatedAssignments = project.assignments.map((assignment) => ({
            ...assignment,
            assignedUsers: assignment.assignedUsers.filter(
              (id) => id !== userId,
            ),
          }));

          // Adiciona o usuário às demandas especificadas
          assignmentIds.forEach((assignmentId) => {
            const assignment = updatedAssignments.find(
              (a) => a._id === assignmentId,
            );
            if (assignment) {
              assignment.assignedUsers.push(userId);
            }
          });

          return { ...project, assignments: updatedAssignments };
        }),
      );

      return response.data; // Retorna a resposta da API
    } catch (err) {
      console.error("Erro ao reatribuir usuário:", err);
      setError(err);
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
    assignUserToAssignments,
  };
};

export default useProjects;
