import { ChevronRight, ChevronLeft } from "lucide-react";
export const SuggestedEvents = ({ suggestedEvents }) => {
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
            <button className="w-full bg-transparent hover:bg-indigo-700 text-indigo-400 hover:text-white border border-indigo-500 rounded py-1.5 text-sm transition-colors">
              I'm Interested
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
