// useProjects.js
// Hook responsável por gerenciar os projetos e as operações relacionadas às assignments.
import { useState, useEffect, useCallback } from "react";
import axiosInstance from "services/axios";

const useProjects = () => {
  // Estados para armazenar projetos, loading e erros
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Função para buscar todos os projetos
  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/flow/projects");
      setProjects(response.data);
    } catch (err) {
      setError(err);
      console.error("Erro ao buscar projetos:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Função para buscar as assignments de um projeto específico
  const fetchAssignments = useCallback(
    async (projectId) => {
      try {
        if (!projectId) {
          console.warn("ID do projeto não fornecido para buscar assignments");
          return [];
        }

        setLoading(true);

        // Garante que os projetos estejam carregados antes de buscar a assignment
        if (projects.length === 0) {
          await fetchProjects();
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

  // Função para criar uma nova assignment no projeto
  const createAssignment = async (projectId, name) => {
    try {
      setLoading(true);
      await axiosInstance.post(`/flow/projects/${projectId}/assignments`, {
        name,
      });
      await fetchProjects();
    } catch (err) {
      setError(err);
      console.error("Erro ao criar assignment:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Função para editar uma assignment existente
  const editAssignment = async (projectId, assignmentId, updatedData) => {
    try {
      setLoading(true);
      await axiosInstance.patch(
        `/flow/projects/${projectId}/assignments/${assignmentId}`,
        updatedData,
      );
      await fetchProjects();
    } catch (err) {
      setError(err);
      console.error("Erro ao editar assignment:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Função para deletar uma assignment do projeto
  const deleteAssignment = async (projectId, assignmentId) => {
    try {
      setLoading(true);
      await axiosInstance.delete(
        `/flow/projects/${projectId}/assignments/${assignmentId}`,
      );
      await fetchProjects();
    } catch (err) {
      setError(err);
      console.error("Erro ao deletar assignment:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Atualiza as transições de uma assignment
  const updateTransitions = async (projectId, assignmentId, transitions) => {
    try {
      setLoading(true);
      await axiosInstance.patch(
        `/flow/projects/${projectId}/assignments/${assignmentId}`,
        { transitions },
      );
    } catch (err) {
      setError(err);
      console.error("Erro ao atualizar transições:", err);
    } finally {
      setLoading(false);
    }
  };

  // Salva o layout (posição dos nodes) do board
  const saveLayout = async (projectId, nodes) => {
    try {
      await axiosInstance.patch(`/flow/projects/${projectId}/layout`, {
        nodes: nodes.map(({ id, position }) => ({ id, position })),
      });
    } catch (err) {
      setError(err);
      console.error("Erro ao salvar layout:", err);
    }
  };

  // Atualiza as assignments com os usuários atribuídos
  const assignUsers = async (projectId, assignments) => {
    try {
      setLoading(true);

      // Corrigido: usamos a propriedade "assignedUsers" e não "assigned"
      const formattedAssignments = assignments.map((assignment, index) => {
        // Caso a propriedade assignedUsers esteja ausente, forçamos para array vazio
        const usersArray = assignment.assignedUsers || [];
        return {
          id: assignment.id,
          assignedUsers: usersArray.map((user, userIndex) => {
            return {
              userId: user.userId,
              regionals: user.regionals || null, // regional opcional
            };
          }),
        };
      });

      const response = await axiosInstance.patch(
        `/flow/projects/${projectId}/assign-users`,
        { assignments: formattedAssignments },
      );

      // Atualiza o estado local para refletir as mudanças
      setProjects((prev) =>
        prev.map((p) =>
          p._id === projectId
            ? {
                ...p,
                assignments: p.assignments.map((a) => {
                  const updated = formattedAssignments.find(
                    (u) => u.id === a._id,
                  );
                  return updated
                    ? {
                        ...a,
                        assignedUsers: updated.assignedUsers.map((u) => ({
                          $oid: u.userId,
                          regionals: u.regionals,
                        })),
                      }
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

  // Carrega os projetos assim que o hook é montado
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createAssignment,
    editAssignment,
    deleteAssignment,
    updateTransitions,
    saveLayout,
    fetchAssignments,
    assignUsers,
  };
};

export default useProjects;
