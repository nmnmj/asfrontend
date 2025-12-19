import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthToken } from "../context/AuthContext";
import { getSocket } from "../socket";

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setToken } = useAuthToken();

  return () => {
    // 1️⃣ Clear JWT
    setToken(null);

    // 2️⃣ Disconnect socket
    const socket = getSocket();
    if (socket) {
      socket.disconnect();
    }

    // 3️⃣ Clear all cached server state
    queryClient.clear();

    // 4️⃣ Redirect to login
    navigate("/login", { replace: true });
  };
};
