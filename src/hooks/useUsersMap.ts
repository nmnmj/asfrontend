import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../api/users.api";

export const useUsersMap = () => {
  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers
  });

  const map = new Map<string, string>();

  users?.forEach(user => {
    map.set(user.id, user.name);
  });

  return map;
};
