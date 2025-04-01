// hooks/useProjects.js
import { useState, useEffect } from "react";
import axiosInstance from "services/axios";

const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/flow/projects");
      setProjects(response.data);
    } catch (err) {
      setError(err);
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
      await fetchProjects();
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const createAssignment = async (projectId, name) => {
    try {
      setLoading(true);
      await axiosInstance.post(`/flow/projects/${projectId}/assignments`, {
        name,
      });
      await fetchProjects();
    } catch (err) {
      setError(err);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createAssignment,
    editAssignment,
    deleteAssignment,
    updateTransitions,
  };
};

export default useProjects;
