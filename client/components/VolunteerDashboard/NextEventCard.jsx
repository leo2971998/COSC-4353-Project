import {
  Calendar,
  Clock,
  MapPin,
  Briefcase,
  ChevronRight,
  X,
} from "lucide-react";
import { useState } from "react";
export const NextEventCard = ({
  eventName,
  date,
  time,
  location,
  category,
  eventInfo,
  event,
}) => {
  const [showPopup, setShowPopup] = useState(false);
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const startTime = new Date(date).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  const endTime = new Date(time).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="bg-[#222b45] rounded-xl p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your Next Event</h2>
      </div>
      {event ? (
        <div className="bg-[#1a2035] rounded-lg p-5">
          <h3 className="text-xl font-semibold text-indigo-400">{eventName}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="flex items-center">
              <Calendar className="mr-3 text-indigo-400" size={18} />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center">
              <Clock className="mr-3 text-indigo-400" size={18} />
              <span>
                {startTime} - {endTime}
              </span>
            </div>
            <div className="flex items-center">
              <MapPin className="mr-3 text-indigo-400" size={18} />
              <span>{location}</span>
            </div>
            <div className="flex items-center">
              <Briefcase className="mr-3 text-indigo-400" size={18} />
              <span>{category}</span>
            </div>
          </div>
          <button
            onClick={() => setShowPopup(true)}
            className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg flex items-center"
          >
            View Details
            <ChevronRight size={16} className="ml-1" />
          </button>

          {showPopup && (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
              <div className="bg-[#1a2035] text-white rounded-xl p-6 w-[90%] max-w-md relative shadow-lg">
                <button
                  onClick={() => setShowPopup(false)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-red-400"
                >
                  <X size={20} />
                </button>
                <h3 className="text-2xl font-semibold text-indigo-400 mb-4">
                  {eventName}
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center">
                    <Calendar className="mr-3 text-indigo-400" size={18} />
                    <span>{formattedDate}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-3 text-indigo-400" size={18} />
                    <span>
                      {startTime} - {endTime}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="mr-3 text-indigo-400" size={18} />
                    <span>{location}</span>
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="mr-3 text-indigo-400" size={18} />
                    <span>{category}</span>
                  </div>
                </div>
                <div className="mt-6">
                  <p className="text-gray-300">{eventInfo}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-[#1a2035] rounded-lg p-5 flex justify-center items-center">
          <Calendar className="mr-3 text-indigo-400" size={18} />
          <p>No Upcoming Events</p>
        </div>
      )}
    </div>
  );
};
