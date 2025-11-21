// frontend/src/services/taskService.js
import { apiRequest } from "./authService";

export const taskService = {
  async getTasks() {
    return apiRequest("/tasks");
  },

  async createTask(taskData) {
    return apiRequest("/tasks", {
      method: "POST",
      body: taskData,
    });
  },

  async updateTask(taskId, taskData) {
    return apiRequest(`/tasks/${taskId}`, {
      method: "PUT",
      body: taskData,
    });
  },

  async deleteTask(taskId) {
    return apiRequest(`/tasks/${taskId}`, {
      method: "DELETE",
    });
  },
};

export default taskService;
