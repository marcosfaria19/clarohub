import axiosInstance from "services/axios";

export const DemandService = {
  async fetchTasks(projectId, assignmentId) {
    try {
      const response = await axiosInstance.get(
        `/projects/${projectId}/assignments/${assignmentId}/tasks`,
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar tasks:", error);
      throw error;
    }
  },

  async fetchFinishedTasks(projectId, assignmentId) {
    try {
      const response = await axiosInstance.get(
        `/projects/${projectId}/assignments/${assignmentId}/finished-tasks`,
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar tasks finalizadas:", error);
      throw error;
    }
  },

  async handleTreat(projectId, assignmentId) {
    try {
      const response = await axiosInstance.post(
        `/projects/${projectId}/assignments/${assignmentId}/next-task`,
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao tratar task:", error);
      throw error;
    }
  },

  async updateTaskStatus(taskId, newStatusId, obs) {
    try {
      const response = await axiosInstance.patch(`/mdu/${taskId}/status`, {
        newStatusId,
        obs,
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      throw error;
    }
  },
};
