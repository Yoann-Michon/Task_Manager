import type { Task, TaskStats } from "../models/tasks.interface";
import { api } from "./api.service";

export const taskService = {

  getAll: async (): Promise<Task[]> => {
    return api<Task[]>('/tasks');
  },

  getById: async (id: number): Promise<Task> => {
    return api<Task>(`/tasks/${id}`);
  },

  create: async (task: Task): Promise<Task> => {
    return api<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify({
        title: task.title,
        description: task.description,
        status: task.status || 'todo',
        type: task.type || ''
      }),
    });
  },

  update: async (id: number, task: Task): Promise<Task> => {
    return api<Task>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        title: task.title,
        description: task.description,
        status: task.status,
        type: task.type || ''
      }),
    });
  },

  delete: async (id: number): Promise<Response> => {
    return api<Response>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  },

  getStats: async (): Promise<TaskStats> => {
    return api<TaskStats>('/tasks/stats');
  },

  changeStatus: async (
    id: number,
    status: 'todo' | 'pending' | 'done'
  ): Promise<Task> => {
    const task = await taskService.getById(id);
    return taskService.update(id, { ...task, status });
  },

  markAsDone: async (id: number): Promise<Task> => {
    return taskService.changeStatus(id, 'done');
  },

  markAsPending: async (id: number): Promise<Task> => {
    return taskService.changeStatus(id, 'pending');
  },

  markAsTodo: async (id: number): Promise<Task> => {
    return taskService.changeStatus(id, 'todo');
  },
};

export default taskService;