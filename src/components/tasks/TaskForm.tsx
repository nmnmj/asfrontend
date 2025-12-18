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
    queryFn: getAllUsers
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          description: initialData.description,
          dueDate: initialData.dueDate.slice(0, 16),    
          priority: initialData.priority,
          status: initialData.status,
          assignedToId: initialData.assignedToId
        }
      : undefined
  });

  const onSubmitHandler = async (data: TaskFormData) => {
    const payload = {
        ...data,
        dueDate: new Date(data.dueDate).toISOString()
    };

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-3">
      <input
        {...register("title")}
        placeholder="Title"
        className="w-full rounded border p-2"
      />

      <textarea
        {...register("description")}
        placeholder="Description"
        className="w-full rounded border p-2"
      />

      <input
        type="datetime-local"
        {...register("dueDate")}
        className="w-full rounded border p-2"
      />

      <select {...register("priority")} className="w-full rounded border p-2">
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
        <option value="Urgent">Urgent</option>
      </select>

      <select {...register("status")} className="w-full rounded border p-2">
        <option value="To Do">To Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Review">Review</option>
        <option value="Completed">Completed</option>
      </select>

      {/* ✅ Assigned User Dropdown */}
      <select
        {...register("assignedToId")}
        className="w-full rounded border p-2"
      >
        <option value="">Assign to user</option>
        {users?.map(user => (
          <option key={user.id} value={user.id}>
            {user.name} ({user.email})
          </option>
        ))}
      </select>

      {errors.assignedToId && (
        <p className="text-sm text-red-500">
          Assigned user is required
        </p>
      )}

      <button
        disabled={isSubmitting}
        className="rounded bg-blue-600 px-4 py-2 text-white"
      >
        {isSubmitting ? "Saving..." : "Save Task"}
      </button>
    </form>
  );
}
