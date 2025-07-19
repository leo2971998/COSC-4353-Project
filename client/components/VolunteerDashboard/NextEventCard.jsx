import { Calendar, Clock, MapPin, Briefcase, ChevronRight } from "lucide-react";
export const NextEventCard = ({
  eventName,
  date,
  time,
  location,
  category,
  event,
}) => {
  return (
    <div className="bg-[#222b45] rounded-xl p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your Next Event</h2>
      </div>
      <div className="bg-[#1a2035] rounded-lg p-5">
        <h3 className="text-xl font-semibold text-indigo-400">{eventName}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="flex items-center">
            <Calendar className="mr-3 text-indigo-400" size={18} />
            <span>{date}</span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-3 text-indigo-400" size={18} />
            <span>{time}</span>
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
        <button className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg flex items-center">
          View Details
          <ChevronRight size={16} className="ml-1" />
        </button>
      </div>
    </div>
  );
};
