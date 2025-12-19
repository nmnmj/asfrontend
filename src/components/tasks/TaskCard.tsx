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
    task.creator?.name || usersMap.get(task.creatorId) || "Unknown user";

  const assigneeName =
    task.assignedTo?.name || usersMap.get(task.assignedToId) || "Unassigned";

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <h3 className="text-sm font-semibold text-gray-800">{task.title}</h3>
      </div>

      <p className="mt-1 text-sm text-gray-600 line-clamp-2">
        {task.description}
      </p>

      <div className="mt-2 grid grid-cols-2 gap-x-4 text-xs text-gray-600">
        <p>
          Status:{" "}
          <span className="font-medium text-gray-800">{task.status}</span>
        </p>
        <p>
          Priority:{" "}
          <span className="font-medium text-gray-800">{task.priority}</span>
        </p>
        <p className="col-span-2">
          Due:{" "}
          <span className="font-medium text-gray-800">
            {new Date(task.dueDate).toLocaleString()}
          </span>
        </p>
      </div>

      <div className="mt-2 flex justify-between text-xs text-gray-600">
        <p>
          Created by{" "}
          <span className="font-medium text-gray-800">{creatorName}</span>
        </p>
        <p>
          Assigned to{" "}
          <span className="font-medium text-gray-800">{assigneeName}</span>
        </p>
      </div>

      <div className="mt-3 flex justify-end gap-4 text-sm">
        <button
          onClick={onEdit}
          className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="font-medium text-red-600 hover:text-red-700 hover:underline"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
