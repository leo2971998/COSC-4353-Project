import { Bell, Check, X, ChevronRight } from "lucide-react";
export const NotificationsPanel = ({ notifications }) => {
  return (
    <div className="bg-[#222b45] rounded-xl p-6 h-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Bell className="text-indigo-400 mr-2" size={20} />
          <h2 className="text-xl font-semibold">Notifications</h2>
        </div>
        <span className="bg-indigo-600 text-xs px-2 py-1 rounded-full">
          {notifications.length} new
        </span>
      </div>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div key={notification.id} className="bg-[#1a2035] rounded-lg p-4">
            <div className="flex justify-between">
              <h3 className="font-medium">{notification.eventName}</h3>
              <span className="text-xs text-gray-400">{notification.time}</span>
            </div>
            <p className="text-sm text-gray-300 mt-1 mb-3">
              {notification.message}
            </p>
            {notification.actionRequired ? (
              <div className="flex space-x-2">
                <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-1.5 px-3 rounded text-sm flex items-center justify-center">
                  <Check size={14} className="mr-1" />
                  Accept
                </button>
                <button className="flex-1 bg-transparent hover:bg-gray-700 text-white py-1.5 px-3 border border-gray-600 rounded text-sm flex items-center justify-center">
                  <X size={14} className="mr-1" />
                  Decline
                </button>
              </div>
            ) : (
              <button className="w-full bg-transparent hover:bg-gray-700 text-white py-1.5 px-3 border border-gray-600 rounded text-sm flex items-center justify-center">
                View Details
                <ChevronRight size={14} className="ml-1" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
