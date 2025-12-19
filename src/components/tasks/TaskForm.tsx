import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema, type TaskFormData } from "../../validators/task.schema";
import type { Task } from "../../types/task.types";
import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../../api/users.api";

type Props = {
  initialData?: Task;
  onSubmit: (data: TaskFormData) => Promise<void>;
};

export default function TaskForm({ initialData, onSubmit }: Props) {
  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          description: initialData.description,
          dueDate: initialData.dueDate.slice(0, 16),
          priority: initialData.priority,
          status: initialData.status,
          assignedToId: initialData.assignedToId,
        }
      : undefined,
  });

  const onSubmitHandler = async (data: TaskFormData) => {
    const payload = {
      ...data,
      dueDate: new Date(data.dueDate).toISOString(),
    };

    await onSubmit(payload);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmitHandler)}
      className="grid grid-cols-1 gap-3 md:grid-cols-2"
    >
      {/* Title */}
      <input
        {...register("title")}
        placeholder="Task Title"
        className="col-span-2 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />

      {/* Description */}
      <textarea
        {...register("description")}
        placeholder="Task Description"
        rows={2}
        className="col-span-2 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />

      {/* Due Date */}
      <input
        type="datetime-local"
        {...register("dueDate")}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />

      {/* Priority */}
      <select
        {...register("priority")}
        className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
        <option value="Urgent">Urgent</option>
      </select>

      {/* Status */}
      <select
        {...register("status")}
        className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="To Do">To Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Review">Review</option>
        <option value="Completed">Completed</option>
      </select>

      {/* Assigned User */}
      <select
        {...register("assignedToId")}
        className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="">Assign user</option>
        {users?.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>

      {/* Error */}
      {errors.assignedToId && (
        <p className="col-span-2 text-xs text-red-600">
          Assigned user is required
        </p>
      )}

      {/* Submit */}
      <div className="col-span-2 flex justify-end">
        <button
          disabled={isSubmitting}
          className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Task"}
        </button>
      </div>
    </form>
  );
}
