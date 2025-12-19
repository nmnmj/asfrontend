import { io, Socket } from "socket.io-client";
import { getAuthToken } from "./utils/authToken";

let socket: Socket | null = null;

export const connectSocket = () => {
  if (!socket) {
    const token = getAuthToken();

    if (!token) {
      console.warn("Socket not connected: no token");
      return null;
    }

    socket = io(import.meta.env.VITE_SOCKET_URL, {
      auth: {
        token: `Bearer ${token}`,
      },
    });

    socket.on("connect", () => {
      console.log("✅ SOCKET CONNECTED:", socket?.id);
    });

    socket.on("connect_error", err => {
      console.error("❌ SOCKET ERROR:", err.message);
    });
  }

  return socket;
};

export const getSocket = () => socket;
