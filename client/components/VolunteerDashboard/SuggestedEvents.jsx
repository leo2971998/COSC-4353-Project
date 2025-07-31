import { useState } from "react";
import {
  ChevronRight,
  ChevronLeft,
  X,
  Calendar,
  Clock,
  MapPin,
  Briefcase,
} from "lucide-react";
export const SuggestedEvents = ({ suggestedEvents }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const openPopup = (event) => {
    setSelectedEvent(event);
    setShowPopup(true);
  };

  const closePopup = () => {
    setSelectedEvent(null);
    setShowPopup(false);
  };

  return (
    <div className="bg-[#222b45] rounded-xl p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Suggested Events</h2>
        <div className="flex space-x-2">
          <button className="p-1 rounded-full bg-[#1a2035] hover:bg-indigo-700">
            <ChevronLeft size={20} />
          </button>
          <button className="p-1 rounded-full bg-[#1a2035] hover:bg-indigo-700">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 overflow-x-auto">
        {suggestedEvents.map((event) => (
          <div
            key={event.eventID}
            className="bg-[#1a2035] rounded-lg p-4 min-w-[250px]"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-medium">{event.eventName}</h3>
              <span className="bg-indigo-600 text-xs px-2 py-1 rounded-full">
                {event.percentMatch}% match
              </span>
            </div>
            <p className="text-gray-300 text-sm mb-3">
              {event.date} at {event.time}
            </p>
            <button
              onClick={() => openPopup(event)}
              className="w-full bg-transparent hover:bg-indigo-700 text-indigo-400 hover:text-white border border-indigo-500 rounded py-1.5 text-sm transition-colors"
            >
              I'm Interested
            </button>
          </div>
        ))}
      </div>

      {showPopup && selectedEvent && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-[#1a2035] text-white rounded-xl p-6 w-[90%] max-w-md relative shadow-lg">
            <button
              onClick={closePopup}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-400"
            >
              <X size={20} />
            </button>

            <h3 className="text-2xl font-semibold text-indigo-400 mb-4">
              {selectedEvent.eventName}
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex items-center">
                <Calendar className="mr-3 text-indigo-400" size={18} />
                <span>{selectedEvent.date}</span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-3 text-indigo-400" size={18} />
                <span>{selectedEvent.time}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="mr-3 text-indigo-400" size={18} />
                <span>{selectedEvent.location || "TBD"}</span>
              </div>
              <div className="flex items-center">
                <Briefcase className="mr-3 text-indigo-400" size={18} />
                <span>{selectedEvent.category || "General"}</span>
              </div>
            </div>

            <div className="mt-6 text-sm text-gray-300">
              <p>
                This is a detailed view of the event. Add description or RSVP
                notes here if available.
              </p>
            </div>

            <button
              onClick={() => {
                // You handle actual request here
                console.log("Confirming interest in:", selectedEvent);
                closePopup(); // Close for now
              }}
              className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg"
            >
              Confirm Interest
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
