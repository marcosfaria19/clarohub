import { useState, useEffect, useCallback } from "react";
import axiosInstance from "services/axios";

const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/flow/projects");
      setProjects(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

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

  const createAssignment = async (projectId, name) => {
    try {
      setLoading(true);
      await axiosInstance.post(`/flow/projects/${projectId}/assignments`, {
        name,
      });
      await fetchProjects();
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

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
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteAssignment = async (projectId, assignmentId) => {
    try {
      setLoading(true);
      await axiosInstance.delete(
        `/flow/projects/${projectId}/assignments/${assignmentId}`,
      );
      await fetchProjects();
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTransitions = async (projectId, assignmentId, transitions) => {
    try {
      setLoading(true);
      await axiosInstance.patch(
        `/flow/projects/${projectId}/assignments/${assignmentId}`,
        { transitions },
      );
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const saveLayout = async (projectId, nodes) => {
    try {
      await axiosInstance.patch(`/flow/projects/${projectId}/layout`, {
        nodes: nodes.map(({ id, position }) => ({ id, position })),
      });
    } catch (err) {
      setError(err);
    }
  };

  const assignUsers = async (projectId, assignments) => {
    try {
      setLoading(true);

      // Formata os dados para o backend
      const formattedAssignments = assignments.map((assignment) => ({
        id: assignment.id,
        assignedUsers: assignment.assigned.map((user) => ({
          userId: user.userId,
          regional: user.regional || null, // Permite regional opcional
        })),
      }));

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
                          regional: u.regional,
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
