import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useAuthToken } from "../../context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { getSocket } from "../../socket";
import NotificationsPanel from "../notifications/NotificationsPanel";
import { toastSuccess } from "../../utils/toast";

export default function Navbar() {
  const { data: user } = useAuth();
  const { setToken } = useAuthToken();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    // 1️⃣ Clear JWT
    setToken(null);

    // 2️⃣ Disconnect socket
    const socket = getSocket();
    if (socket) {
      socket.disconnect();
    }

    // 3️⃣ Clear cached queries
    queryClient.clear();
    toastSuccess("Logged out successfully");
    // 4️⃣ Redirect
    navigate("/login", { replace: true });
  };

  return (
    <nav className="flex items-center justify-between bg-gray-900 px-6 py-3 text-white">
      {/* ✅ Always visible brand */}
      <Link to="/" className="text-lg font-semibold">
        Task Manager
      </Link>

      {/* ✅ Right side */}
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link to="/tasks" className="hover:underline">
              Tasks
            </Link>

            <Link to="/profile" className="hover:underline">
              Profile
            </Link>

            <NotificationsPanel />

            <span className="text-sm text-gray-300">
              {user.name}
            </span>

            <button
              onClick={handleLogout}
              className="rounded bg-red-600 px-3 py-1 text-sm hover:bg-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            {/* Optional: show auth links when logged out */}
            <Link to="/login" className="hover:underline">
              Login
            </Link>

            <Link
              to="/register"
              className="rounded bg-blue-600 px-3 py-1 text-sm hover:bg-blue-700"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
