import type { Task } from "../../types/task.types";
import { useUsersMap } from "../../hooks/useUsersMap";

type Props = {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
};

export default function TaskCard({ task, onEdit, onDelete }: Props) {
  const usersMap = useUsersMap();

  const creatorName =
    task.creator?.name ||
    usersMap.get(task.creatorId) ||
    "Unknown user";

  const assigneeName =
    task.assignedTo?.name ||
    usersMap.get(task.assignedToId) ||
    "Unassigned";

  return (
    <div className="rounded border p-4 shadow-sm space-y-1">
      <h3 className="font-semibold">{task.title}</h3>

      <p className="text-sm text-gray-700">{task.description}</p>

      <div className="text-sm text-gray-600">
        <p>Status: {task.status}</p>
        <p>Priority: {task.priority}</p>
        <p>Due: {new Date(task.dueDate).toLocaleString()}</p>
      </div>

      <div className="text-sm mt-2">
        <p>
          Created by:{" "}
          <span className="font-medium">{creatorName}</span>
        </p>
        <p>
          Assigned to:{" "}
          <span className="font-medium">{assigneeName}</span>
        </p>
      </div>

      <div className="mt-3 flex gap-3">
        <button onClick={onEdit} className="text-blue-600 text-sm">
          Edit
        </button>
        <button onClick={onDelete} className="text-red-600 text-sm">
          Delete
        </button>
      </div>
    </div>
  );
}
