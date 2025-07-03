import { useEffect, useState } from "react";

export default function NotificationCenter({ notifications = [] }) {
  const [visibleNotifications, setVisibleNotifications] = useState([]);

  useEffect(() => {
    // Add new notifications to visible list
    setVisibleNotifications((prev) => [
      ...prev,
      ...notifications.map((msg, index) => ({
        id: `${Date.now()}-${index}`,
        message: msg,
      })),
    ]);
  }, [notifications]);

  useEffect(() => {
    // Auto-dismiss each notification after 4 seconds
    const timers = visibleNotifications.map((notif) =>
      setTimeout(() => {
        setVisibleNotifications((prev) =>
          prev.filter((n) => n.id !== notif.id)
        );
      }, 4000)
    );

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [visibleNotifications]);

  return (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      {visibleNotifications.map((notif) => (
        <div
          key={notif.id}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow-lg animate-fade-in-up"
        >
          {notif.message}
        </div>
      ))}
    </div>
  );
}