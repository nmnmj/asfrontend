import { api } from "./axios";
import type { Task } from "../types/task.types";

// 🔑 Normalize MongoDB response → frontend model
const normalizeTask = (task: any): Task => ({
  id: task._id,
  title: task.title,
  description: task.description,
  dueDate: task.dueDate,
  priority: task.priority,
  status: task.status,
  creatorId: task.creatorId,
  assignedToId: task.assignedToId,
  createdAt: task.createdAt,
  updatedAt: task.updatedAt
});

export const getTasks = async (): Promise<Task[]> => {
  const { data } = await api.get("/tasks");
  return data.map(normalizeTask);
};

export const getTaskById = async (id: string): Promise<Task> => {
  const { data } = await api.get(`/tasks/${id}`);
  return normalizeTask(data);
};

export const createTask = async (payload: Partial<Task>): Promise<Task> => {
  const { data } = await api.post("/tasks", payload);
  return normalizeTask(data);
};

export const updateTask = async (
  id: string,
  payload: Partial<Task>
): Promise<Task> => {
  const { data } = await api.put(`/tasks/${id}`, payload);
  return normalizeTask(data);
};

export const deleteTask = async (id: string) => {
  await api.delete(`/tasks/${id}`);
};
