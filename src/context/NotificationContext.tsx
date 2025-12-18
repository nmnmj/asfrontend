import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  getNotifications,
  markNotificationAsRead
} from "../api/notification.api";

export type Notification = {
  id: string;
  message: string;
  createdAt: string;
  isRead: boolean;
};

type NotificationContextType = {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
};

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // 🔹 Fetch persisted notifications AFTER login
  useEffect(() => {
    if (!user?.id) return;

    getNotifications().then(setNotifications);
  }, [user?.id]);

  // 🔹 Add realtime notification
  const addNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
  };

  // 🔹 Mark as read (DB + UI)
  const markAsRead = async (id: string) => {
    await markNotificationAsRead(id);

    setNotifications(prev =>
      prev.map(n =>
        n.id === id ? { ...n, isRead: true } : n
      )
    );
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotifications must be used inside NotificationProvider");
  }
  return ctx;
};
