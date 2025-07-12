// client/components/Layout.jsx
import NotificationCenter from "./NotificationCenter";
import { ToastContainer } from "react-toastify";

export default function Layout({ children, notifications = [] }) {
  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      {/* Global Notifications */}
      <NotificationCenter notifications={notifications} />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      {/* Page Content */}
      {children}
    </div>
  );
}