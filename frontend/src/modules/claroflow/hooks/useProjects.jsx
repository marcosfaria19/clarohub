import { useState, useEffect } from "react";
import axiosInstance from "services/axios";

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/flow/projects");
        setProjects(response.data);

        // Mapeia as demandas e inclui o nome do projeto

        const allAssignments = response.data.flatMap((project) =>
          project.assignments.map((assignments) => ({
            ...assignments,
            project: project.name, // Adiciona o nome do projeto
          })),
        );
        setAssignments(allAssignments);

        setError(null);
      } catch (err) {
        setError("Erro ao carregar projetos");
        console.error("Erro ao buscar projetos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/flow/projects/assignments");
      setAssignments(response.data);
      setError(null);
    } catch (err) {
      setError("Erro ao carregar demandas");
      console.error("Erro ao buscar demandas:", err);
    } finally {
      setLoading(false);
    }
  };

  const addAssignmentToProject = async (projectId, assignment) => {
    try {
      const response = await axiosInstance.post(
        `/flow/projects/${projectId}/assignments`,
        assignment,
      );

      // Atualiza o estado local com o novo assignment
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project._id === projectId
            ? {
                ...project,
                assignments: [...(project.assignments || []), response.data],
              }
            : project,
        ),
      );

      // Atualiza assignments gerais
      setAssignments((prevAssignments) => [...prevAssignments, response.data]);

      return response.data;
    } catch (err) {
      console.error("Erro ao adicionar demanda:", err);
      throw err;
    }
  };

  return {
    projects,
    assignments,
    loading,
    error,
    addAssignmentToProject,
    fetchAssignments,
  };
}
