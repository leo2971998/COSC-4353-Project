// client/components/Layout.jsx
import NotificationCenter from "./NotificationCenter";

export default function Layout({ children, notifications = [] }) {
  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      {/* Global Notifications */}
      <NotificationCenter notifications={notifications} />

      {/* Page Content */}
      {children}
    </div>
  );
}