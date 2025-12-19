import { getSocket } from "../socket";
import { useEffect, useMemo, useState } from "react";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTasks, createTask, updateTask, deleteTask } from "../api/task.api";
import TaskCard from "../components/tasks/TaskCard";
import TaskForm from "../components/tasks/TaskForm";
import type { Task } from "../types/task.types";
import { toastError, toastSuccess } from "../utils/toast";

type StatusFilter = Task["status"] | "ALL";
type PriorityFilter = Task["priority"] | "ALL";
type SortOrder = "ASC" | "DESC";

export default function Tasks() {
  const queryClient = useQueryClient();

  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // 🔹 FILTER STATE
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("ALL");

  // 🔹 SORT STATE
  const [sortOrder, setSortOrder] = useState<SortOrder>("ASC");

  // 🔹 REALTIME SOCKET UPDATES
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const invalidate = () =>
      queryClient.invalidateQueries({ queryKey: ["tasks"] });

    socket.on("task:created", invalidate);
    socket.on("task:updated", invalidate);
    socket.on("task:deleted", invalidate);

    return () => {
      socket.off("task:created", invalidate);
      socket.off("task:updated", invalidate);
      socket.off("task:deleted", invalidate);
    };
  }, [queryClient]);

  // 🔹 FETCH TASKS
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  // 🔹 MUTATIONS
  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      setEditingTask(null);
      toastSuccess("Task created successfully");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (err) => {
      toastError(err, "Failed to create task");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Task> }) =>
      updateTask(id, data),
    onSuccess: () => {
      setEditingTask(null);
      toastSuccess("Task updated");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (err) => {
      toastError(err, "Failed to update task");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      toastSuccess("Task deleted");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (err) => {
      toastError(err, "Failed to delete task");
    },
  });

  // 🔹 FILTER + SORT (DERIVED STATE)
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    if (statusFilter !== "ALL") {
      result = result.filter((task) => task.status === statusFilter);
    }

    if (priorityFilter !== "ALL") {
      result = result.filter((task) => task.priority === priorityFilter);
    }

    result.sort((a, b) => {
      const aTime = new Date(a.dueDate).getTime();
      const bTime = new Date(b.dueDate).getTime();
      return sortOrder === "ASC" ? aTime - bTime : bTime - aTime;
    });

    return result;
  }, [tasks, statusFilter, priorityFilter, sortOrder]);

  if (isLoading) {
    return <p className="p-6">Loading tasks...</p>;
  }

  return (
    <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h1 className="text-lg font-semibold text-gray-800">Task Management</h1>

      {/* 🔹 FILTER & SORT CONTROLS */}
      <div className="flex flex-wrap gap-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="ALL">All Status</option>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Review">Review</option>
          <option value="Completed">Completed</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as PriorityFilter)}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="ALL">All Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Urgent">Urgent</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as SortOrder)}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="ASC">Due Date ↑</option>
          <option value="DESC">Due Date ↓</option>
        </select>
      </div>

      {/* 🔹 TASK FORM */}
      <TaskForm
        key={editingTask?.id ?? "create"}
        initialData={editingTask ?? undefined}
        onSubmit={async (data) => {
          if (editingTask) {
            await updateMutation.mutateAsync({
              id: editingTask.id,
              data,
            });
          } else {
            await createMutation.mutateAsync(data);
          }
        }}
      />

      {editingTask && (
        <button
          onClick={() => setEditingTask(null)}
          className="w-fit text-sm font-medium text-gray-600 hover:text-gray-800 hover:underline"
        >
          Cancel editing
        </button>
      )}

      {/* 🔹 TASK LIST */}
      <div className="grid gap-4">
        {filteredTasks.length === 0 && (
          <p className="text-sm text-gray-500">
            No tasks match the selected filters.
          </p>
        )}

        {filteredTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={() => setEditingTask(task)}
            onDelete={() => deleteMutation.mutate(task.id)}
          />
        ))}
      </div>
    </div>
  );
}
