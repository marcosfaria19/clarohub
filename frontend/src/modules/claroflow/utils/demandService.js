import axiosInstance from "services/axios";

export const DemandService = {
  async fetchTasks(projectId, assignmentId) {
    try {
      const response = await axiosInstance.get(
        `/projects/${projectId}/assignments/${assignmentId}/tasks`,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return [];
    }
  },

  async fetchFinishedTasks(projectId, assignmentId) {
    try {
      const response = await axiosInstance.get(
        `/projects/${projectId}/assignments/${assignmentId}/finished-tasks`,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching finished tasks:", error);
      return [];
    }
  },

  async handleTreat(projectId, assignmentId) {
    try {
      const response = await axiosInstance.post(
        `/projects/${projectId}/assignments/${assignmentId}/handle-task`,
      );
      return response.data;
    } catch (error) {
      console.error("Error handling task:", error);
      throw error;
    }
  },
};
