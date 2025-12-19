// import { useEffect } from "react";
// import { socket } from "../socket"; // side-effect socket
// import { useAuth } from "./useAuth";

// export const useSocket = () => {
//   const { data: user } = useAuth();

//   useEffect(() => {
//     if (!user?.id) return;

//     const joinRoom = () => {
//       socket.emit("join", user.id);
//       console.log("✅ JOIN emitted for user:", user.id);
//     };

//     // Emit immediately if already connected
//     if (socket.connected) {
//       joinRoom();
//     }

//     // Emit again on reconnect (StrictMode / network drops)
//     socket.on("connect", joinRoom);

//     return () => {
//       socket.off("connect", joinRoom);
//     };
//   }, [user?.id]);
// };
