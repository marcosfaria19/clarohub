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
      return response.data; // Retorna os dados para uso direto
    } catch (err) {
      setError(err);
      console.error("Erro ao buscar projetos:", err);
      return []; // Retorna array vazio em caso de erro
    } finally {
      setLoading(false);
    }
  }, []);

  // Função para buscar as assignments de um projeto específico
  // Modificada para evitar dependência circular
  const fetchAssignments = useCallback(
    async (projectId) => {
      try {
        if (!projectId) {
          console.warn("ID do projeto não fornecido para buscar assignments");
          return [];
        }

        setLoading(true);

        // Verifica se o projeto já está no estado
        let projectData = projects.find((p) => p._id === projectId);

        // Se não encontrar o projeto no estado ou se o estado estiver vazio,
        // busca diretamente da API em vez de chamar fetchProjects
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

        return projectData.assignments || [];
      } catch (err) {
        console.error("Erro ao buscar assignments:", err);
        setError(err);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [projects], // Removida a dependência de fetchProjects
  );

  // Função para buscar projetos por projectId
  const fetchProjectById = useCallback(async (projectId) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/flow/projects/${projectId}`);

      return response.data;
    } catch (err) {
      console.error("Erro ao buscar projeto:", err);
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

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

export default useProjects;
