import { useEffect } from "react";
import { getSocket } from "../socket";
import { addNotification } from "../store/notifications";

export const useAssignmentNotifications = () => {
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.on("task:assigned", (task) => {
        console.log("Received task assignment socket:", task);
      addNotification({
        id: task.id,
        message: `${task.title}`,
        createdAt: new Date().toISOString(),
        read: false
      });
    });

    return () => {
      socket.off("task:assigned");
    };
  }, []);
};
