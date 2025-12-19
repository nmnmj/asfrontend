import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Profile from "./pages/Profile";

import ProtectedRoute from "./components/layout/ProtectedRoute";
import Navbar from "./components/layout/Navbar";

import { NotificationProvider } from "./context/NotificationContext";
import { AuthProvider } from "./context/AuthContext"; // ✅ ADD
import { useNotificationSocket } from "./hooks/useNotificationSocket";
import { connectSocket } from "./socket";
import { useAuthToken } from "./context/AuthContext";

function AppInner() {
  const { token } = useAuthToken();

  useEffect(() => {
    if (token) {
      connectSocket();
    }
  }, [token]);

  useNotificationSocket();

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>            {/* 🔑 MUST be outer */}
      <NotificationProvider>
        <AppInner />
      </NotificationProvider>
    </AuthProvider>
  );
}
