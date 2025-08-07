// components/VolunteerDashboard/MyEvents.jsx
import { useState } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

export function MyEvents({ enrolledEvents = [], onRefresh }) {
  const [withdrawing, setWithdrawing] = useState(null);

  const handleWithdraw = async (eventId, eventName) => {
    const confirmed = confirm(
      `Are you sure you want to withdraw from "${eventName}"?`
    );
    if (!confirmed) return;

    setWithdrawing(eventId);

    // Simulate withdrawal API call
    setTimeout(() => {
      alert(`Successfully withdrew from "${eventName}"`);
      setWithdrawing(null);
      onRefresh();
    }, 1000);
  };

  if (enrolledEvents.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">
          No Events Enrolled
        </h3>
        <p className="text-gray-400">You haven't enrolled in any events yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white mb-6">My Events</h2>

      <div className="grid gap-4">
        {enrolledEvents.map((event) => (
          <div
            key={event.event_id}
            className="bg-gray-900 rounded-lg p-6 border border-gray-700"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {event.event_name}
                </h3>

                <div className="flex items-center text-gray-300 mb-2">
                  <Calendar size={16} className="mr-2" />
                  <span className="mr-4">
                    {new Date(event.start_time).toLocaleString([], {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                </div>

                <div className="flex items-center text-gray-300 mb-3">
                  <MapPin size={16} className="mr-2" />
                  <span>{event.event_location}</span>
                </div>

                <p className="text-gray-400 text-sm">
                  {event.event_description}
                </p>
              </div>

              <div className="flex flex-col items-end space-y-2 ml-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    event.status === "confirmed"
                      ? "bg-green-900 text-green-300"
                      : "bg-yellow-900 text-yellow-300"
                  }`}
                >
                  {event.status === "confirmed" ? (
                    <>
                      <CheckCircle size={12} className="inline mr-1" />
                      Confirmed
                    </>
                  ) : (
                    <>
                      <Clock size={12} className="inline mr-1" />
                      Pending
                    </>
                  )}
                </span>

                <button
                  onClick={() =>
                    handleWithdraw(event.event_id, event.event_name)
                  }
                  disabled={withdrawing === event.event_id}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white text-sm rounded-md transition-colors flex items-center"
                >
                  {withdrawing === event.event_id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Withdrawing...
                    </>
                  ) : (
                    <>
                      <AlertTriangle size={16} className="mr-2" />
                      Withdraw
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
