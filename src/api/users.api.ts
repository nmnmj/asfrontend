import { api } from "./axios";
import type { User } from "../types/auth.types";

export const getCurrentUser = async (): Promise<User> => {
  const { data } = await api.get("/users/me");
  return {
    ...data,
    id: data._id,
  };
};

export const updateProfile = async (payload: { name: string }) => {
  const { data } = await api.put("/users/me", payload);
  return {
    ...data,
    id: data._id,
  };
};

export const getAllUsers = async (): Promise<User[]> => {
  const { data } = await api.get("/users/all");

  // 🔥 Normalize _id → id
  return data.map((user: any) => ({
    id: user._id,
    name: user.name,
    email: user.email
  }));
};