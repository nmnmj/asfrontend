import { api } from "./axios";

export type Notification = {
  id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export const getNotifications = async (): Promise<Notification[]> => {
  const { data } = await api.get("/notifications");

  // normalize _id → id
  return data.map((n: any) => ({
    id: n._id,
    message: n.message,
    isRead: n.isRead,
    createdAt: n.createdAt
  }));
};

export const markNotificationAsRead = async (id: string) => {
  await api.patch(`/notifications/${id}/read`);
};
