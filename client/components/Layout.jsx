// client/components/Layout.jsx
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";

export default function Layout({ children, notifications = [] }) {
  const [flash, setFlash] = useState([]);
  const [profileIncomplete, setProfileIncomplete] = useState(false);

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

  useEffect(() => {
    flash.forEach((msg) => toast(msg));
    if (flash.length) setFlash([]);
  }, [flash]);

  useEffect(() => {
    notifications.forEach((msg) => toast(msg));
  }, [notifications]);

  useEffect(() => {
    const check = () => {
      setProfileIncomplete(localStorage.getItem("profileComplete") === "false");
    };
    check();
    window.addEventListener("storage", check);
    return () => window.removeEventListener("storage", check);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      {profileIncomplete && (
        <div className="bg-yellow-600 text-black text-center py-2">
          Please complete your profile for full access.
        </div>
      )}

      {/* Page Content */}
      {children}
    </div>
  );
}
