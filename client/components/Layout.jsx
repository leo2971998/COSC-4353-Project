// client/components/Layout.jsx
import NotificationCenter from "./NotificationCenter";
import { ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";

export default function Layout({ children, notifications = [] }) {
  const [flash, setFlash] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("flashMessages");
    if (stored) {
      try {
        const msgs = JSON.parse(stored);
        if (Array.isArray(msgs)) setFlash(msgs);
      } catch {
        /* ignore */
      }
      localStorage.removeItem("flashMessages");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      {/* Global Notifications */}
      <NotificationCenter notifications={[...flash, ...notifications]} />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      {/* Page Content */}
      {children}
    </div>
  );
}