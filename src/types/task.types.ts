export type Priority = "Low" | "Medium" | "High" | "Urgent";
export type Status = "To Do" | "In Progress" | "Review" | "Completed";

export type TaskStatus =
  | "To Do"
  | "In Progress"
  | "Review"
  | "Completed";

export type TaskPriority =
  | "Low"
  | "Medium"
  | "High"
  | "Urgent";

export interface UserRef {
  id: string;
  name: string;
  email?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  status: Status;

  creatorId: string;
  assignedToId: string;

  creator?: UserRef;
  assignedTo?: UserRef;

  createdAt: string;
  updatedAt: string;
}

export interface NotificationI {
    id: string;
    message: string;
    createdAt: string;
}