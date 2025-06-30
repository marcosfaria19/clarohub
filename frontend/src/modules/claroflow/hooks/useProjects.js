import { useState, useEffect, useCallback } from "react";
import axiosInstance from "services/axios";
import { useCache } from "modules/shared/contexts/CacheContext";
/**
 * Hook otimizado para gerenciamento de projetos com cache inteligente
 *
 * Mantém exatamente a mesma interface do hook original useProjects
 * Adiciona cache compartilhado com TTL de 6 horas
 */
const useProjectsOptimized = () => {
  // Estados para armazenar projetos, loading e erros
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cache = useCache();

  // Função para buscar todos os projetos
  const fetchProjects = useCallback(
    async (forceRefresh = false) => {
      try {
        setLoading(true);
        setError(null);

        // Verifica cache primeiro (se não for refresh forçado)
        if (!forceRefresh) {
          const cachedData = cache.get("projects");
          if (cachedData) {
            setProjects(cachedData);
            setLoading(false);
            return cachedData;
          }
        }

        // Busca da API
        const response = await axiosInstance.get("/flow/projects");
        const projectsData = response.data;

        // Armazena no cache
        cache.set("projects", projectsData);

        setProjects(projectsData);
        setError(null);

        return projectsData;
      } catch (err) {
        setError(err);
        console.error("Erro ao buscar projetos:", err);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [cache],
  );

  // Função para buscar as assignments de um projeto específico
  const fetchAssignments = useCallback(
    async (projectId) => {
      try {
        if (!projectId) {
          console.warn("ID do projeto não fornecido para buscar assignments");
          return [];
        }

        setLoading(true);

        // Verifica cache de assignments específicas do projeto
        const cacheParams = { projectId };
        const cachedAssignments = cache.get("projectAssignments", cacheParams);

        if (cachedAssignments) {
          setLoading(false);
          return cachedAssignments;
        }

        // Verifica se o projeto já está no estado
        let projectData = projects.find((p) => p._id === projectId);

        // Se não encontrar o projeto no estado ou se o estado estiver vazio,
        // busca diretamente da API
        if (!projectData) {
          try {
            const response = await axiosInstance.get(
              `/flow/projects/${projectId}`,
            );
            projectData = response.data;
          } catch (fetchErr) {
            console.error("Erro ao buscar projeto específico:", fetchErr);
            return [];
          }
        }

        if (!projectData) {
          console.warn(`Projeto com ID ${projectId} não encontrado`);
          return [];
        }

        const assignments = projectData.assignments || [];

        // Cache das assignments específicas do projeto
        cache.set("projectAssignments", assignments, cacheParams);

        return assignments;
      } catch (err) {
        console.error("Erro ao buscar assignments:", err);
        setError(err);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [projects, cache],
  );

  // Função para buscar projetos por projectId
  const fetchProjectById = useCallback(
    async (projectId) => {
      try {
        setLoading(true);

        // Verifica cache específico do projeto
        const cacheParams = { projectId };
        const cachedProject = cache.get("singleProject", cacheParams);

        if (cachedProject) {
          setLoading(false);
          return cachedProject;
        }

        const response = await axiosInstance.get(`/flow/projects/${projectId}`);
        const projectData = response.data;

        // Cache do projeto específico
        cache.set("singleProject", projectData, cacheParams);

        return projectData;
      } catch (err) {
        console.error("Erro ao buscar projeto:", err);
        setError(err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [cache],
  );

  // Função para criar uma nova assignment no projeto
  const createAssignment = async (projectId, name) => {
    try {
      setLoading(true);
      await axiosInstance.post(`/flow/projects/${projectId}/assignments`, {
        name,
      });

      // Invalida caches relacionados após modificação
      cache.invalidateType("projects");
      cache.invalidateKey("projectAssignments", { projectId });
      cache.invalidateKey("singleProject", { projectId });

      await fetchProjects(true); // Force refresh
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

      // Invalida caches relacionados após modificação
      cache.invalidateType("projects");
      cache.invalidateKey("projectAssignments", { projectId });
      cache.invalidateKey("singleProject", { projectId });

      await fetchProjects(true); // Force refresh
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

      // Invalida caches relacionados após modificação
      cache.invalidateType("projects");
      cache.invalidateKey("projectAssignments", { projectId });
      cache.invalidateKey("singleProject", { projectId });

      await fetchProjects(true); // Force refresh
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

      // Invalida caches relacionados após modificação
      cache.invalidateKey("projectAssignments", { projectId });
      cache.invalidateKey("singleProject", { projectId });
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

      // Invalida cache do projeto específico após salvar layout
      cache.invalidateKey("singleProject", { projectId });
    } catch (err) {
      setError(err);
      console.error("Erro ao salvar layout:", err);
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
    fetchProjectById,
  };
};

export default useProjectsOptimized;
