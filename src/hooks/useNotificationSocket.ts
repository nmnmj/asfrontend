import { useEffect } from "react";
import { getSocket } from "../socket";
import { useNotifications } from "../context/NotificationContext";

export const useNotificationSocket = () => {
  const { addNotification } = useNotifications();

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handler = (notification: any) => {
      addNotification({
        id: notification._id,
        message: notification.message,
        isRead: false,
        createdAt: notification.createdAt
      });
    };

    socket.on("notification:new", handler);

    return () => {
      socket.off("notification:new", handler);
    };
  }, [addNotification]);
};
