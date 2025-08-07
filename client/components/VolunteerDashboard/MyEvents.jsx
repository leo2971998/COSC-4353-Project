import { useState } from "react";
import { Calendar, MapPin, Clock, AlertTriangle } from "lucide-react";
import { ConfirmModal } from "./ConfirmModal";
import axios from "axios";

export function MyEvents({ enrolledEvents = [], onRefresh }) {
  const [withdrawing, setWithdrawing] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  const handleWithdraw = async () => {
    if (!selectedEvent) return;

    const userID = localStorage.getItem("userId");
    const eventID = selectedEvent.event_id;
    setWithdrawing(selectedEvent.event_id);

    try {
      await axios.delete(
        `${API_URL}/volunteer-dashboard/enrolled-events/${userID}/${eventID}`
      );
      alert(`Successfully withdrew from "${selectedEvent.event_name}"`);
      setSelectedEvent(null);
      setWithdrawing(null);
      onRefresh();
    } catch (error) {
      console.error("Withdraw failed", error);
      alert("Something went wrong. Try again later.");
      setWithdrawing(null);
    }
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
      <h2 className="text-2xl font-bold text-white mb-6">My Enrolled Events</h2>

      <div className="grid gap-4">
        {enrolledEvents.map((event) => (
          <div
            key={event.event_id}
            className="bg-gray-900 rounded-lg p-6 border border-gray-700"
          >
            <h3 className="text-xl font-semibold text-white mb-2">
              {event.event_name}
            </h3>

            <div className="flex items-center text-gray-300 mb-2">
              <Calendar size={16} className="mr-2" />
              <span className="mr-4">
                {new Date(event.start_time).toLocaleString([], {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}{" "}
                -{" "}
                {new Date(event.end_time).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </span>
            </div>

            <div className="flex items-center text-gray-300 mb-3">
              <MapPin size={16} className="mr-2" />
              <span>{event.event_location}</span>
            </div>

            <p className="text-gray-400 text-sm mb-4">
              {event.event_description}
            </p>

            <button
              onClick={() => setSelectedEvent(event)}
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
        ))}
        <ConfirmModal
          isOpen={!!selectedEvent}
          title="Confirm Withdrawal"
          message={`Are you sure you want to withdraw from "${selectedEvent?.event_name}"? This action cannot be undone and may affect other volunteers depending on you.`}
          onCancel={() => setSelectedEvent(null)}
          onConfirm={handleWithdraw}
        />
      </div>
    </div>
  );
}
