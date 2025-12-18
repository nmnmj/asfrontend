import { useQuery } from "@tanstack/react-query";
import { getTasks } from "../api/task.api";

export default function Dashboard() {
  const { data } = useQuery({ queryKey: ["tasks"], queryFn: getTasks });

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">My Dashboard</h1>
      <p>Total Tasks: {data?.length ?? 0}</p>
    </div>
  );
}
