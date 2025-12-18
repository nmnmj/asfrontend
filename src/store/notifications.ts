export type Notification = {
  id: string;
  message: string;
  createdAt: string;
  read: boolean;
};

let notifications: Notification[] = [];

export const addNotification = (notification: Notification) => {
  notifications.unshift(notification);
};

export const getNotifications = () => notifications;

export const markAsRead = (id: string) => {
  notifications = notifications.map(n =>
    n.id === id ? { ...n, read: true } : n
  );
};
