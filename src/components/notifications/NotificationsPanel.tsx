import { useState } from "react";
import { useNotifications } from "../../context/NotificationContext";

export default function NotificationsPanel() {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* 🔔 Bell */}
      <button
        onClick={() => setOpen(o => !o)}
        className="relative"
        aria-label="Notifications"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-600" />
        )}
      </button>

      {open && (
        <>
          {/* ================= MOBILE BACKDROP ================= */}
          <div
            className="text-black fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={() => setOpen(false)}
          />

          {/* ================= MOBILE PANEL ================= */}
          <div
            className="
              text-black
              fixed bottom-0 left-0 right-0 z-50
              max-h-[70vh] overflow-auto
              rounded-t-xl bg-white shadow-lg
              md:hidden
            "
          >
            <div className="flex items-center justify-between border-b p-4">
              <p className="font-medium">Notifications</p>
              <button
                onClick={() => setOpen(false)}
                className="text-sm text-gray-500"
              >
                Close
              </button>
            </div>

            {notifications.length === 0 && (
              <p className="p-4 text-sm text-gray-500">
                No notifications
              </p>
            )}

            {notifications.map(n => (
              <div
                key={n.id}
                onClick={() => !n.isRead && markAsRead(n.id)}
                className={`border-b p-4 text-sm cursor-pointer
                  ${n.isRead ? "bg-white" : "bg-blue-50"}
                `}
              >
                <p>{n.message}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {/* ================= DESKTOP DROPDOWN ================= */}
          <div
            className="
              text-black
              absolute right-0 mt-2 z-50
              w-80 max-h-96 overflow-auto
              rounded border bg-white shadow
              hidden md:block
            "
          >
            {notifications.length === 0 && (
              <p className="p-3 text-sm text-gray-500">
                No notifications
              </p>
            )}

            {notifications.map(n => (
              <div
                key={n.id}
                onClick={() => !n.isRead && markAsRead(n.id)}
                className={`border-b p-3 text-sm cursor-pointer
                  ${n.isRead ? "bg-white" : "bg-blue-50"}
                `}
              >
                <p>{n.message}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
