import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { logout } from "../../api/auth.api";
import { useQueryClient } from "@tanstack/react-query";
import NotificationsPanel from "../notifications/NotificationsPanel";

export default function Navbar() {
  const { data: user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await logout();
    queryClient.clear();
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between bg-gray-900 px-6 py-3 text-white">
      <Link to="/" className="text-lg font-semibold">
        Task Manager
      </Link>

      {user && (
        <div className="flex items-center gap-4">
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
        </div>
      )}
    </nav>
  );
}
