import { useQuery } from "@tanstack/react-query";
import { getTasks } from "../api/task.api";

export default function Dashboard() {
  const { data } = useQuery({ queryKey: ["tasks"], queryFn: getTasks });

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h1 className="mb-2 text-lg font-semibold text-gray-800">
        Dashboard Overview
      </h1>
      <p className="text-sm text-gray-600">
        Total Tasks:{" "}
        <span className="font-medium text-gray-800">{data?.length ?? 0}</span>
      </p>
    </div>
  );
}
