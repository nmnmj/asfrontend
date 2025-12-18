import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../api/users.api";

export const useAuth = () => {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000
  });
};
