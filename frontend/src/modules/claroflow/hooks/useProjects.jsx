import { useState, useEffect } from "react";
import axiosInstance from "../services/axiosInstance";

const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Função para buscar todos os projetos
  const fetchProjects = async () => {
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
  };

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
  const createAssignment = async (projectId, assignmentName) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(
        `/flow/projects/${projectId}/assignments`,
        { name: assignmentName },
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

  // Hook para buscar projetos ao carregar
  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    error,
    loading,
    fetchProjects,
    fetchAssignments,
    createAssignment,
  };
};

export default useProjects;
