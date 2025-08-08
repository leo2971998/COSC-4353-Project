import { MapPin, Settings, List, Share2, Star } from "lucide-react";

export function EventCard({ event, onClick }) {
  const truncateDescription = (description, maxLength) => {
    if (!description) return "";
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + "...";
  };

  const displaySkills = (skills) => {
    if (!skills) return "No skills specified";
    const skillArray = skills.split(",").map((s) => s.trim());
    if (skillArray.length > 2) {
      return `${skillArray[0]}, ${skillArray[1]} and ${
        skillArray.length - 2
      } more`;
    }
    return skills;
  };

  return (
    <div
      className="bg-gray-900 rounded-lg p-6 border border-gray-700 hover:border-indigo-600 transition-colors cursor-pointer flex flex-col h-full"
      onClick={() => onClick(event)}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-white flex-1 pr-4">
          {event.event_name}
          {event.event_status ? (
            <span
              className={`text-xs ${
                event.event_status === "Upcoming"
                  ? "bg-green-700"
                  : "bg-gray-700"
              } px-2 py-1 rounded ml-2`}
            >
              {event.event_status === "Upcoming"
                ? "Enrolled"
                : event.event_status}
            </span>
          ) : null}
        </h3>
        <div className="flex space-x-2 text-gray-400">
          <button className="hover:text-white transition-colors p-1 rounded-md">
            <Share2 size={18} />
          </button>
          <button className="hover:text-white transition-colors p-1 rounded-md">
            <Star size={18} />
          </button>
        </div>
      </div>

      <div className="space-y-2 text-gray-300 text-sm mb-4">
        <div className="flex items-center">
          <MapPin size={16} className="mr-2 text-indigo-400" />
          <span>{event.event_location}</span>
        </div>
        <div className="flex items-center">
          <Settings size={16} className="mr-2 text-indigo-400" />
          <span>
            {Array.isArray(event.skills) && event.skills.length
              ? event.skills.length > 2
                ? `${event.skills[0]}, ${event.skills[1]} and ${
                    event.skills.length - 2
                  } more`
                : event.skills.join(", ")
              : "No skills specified"}
          </span>
        </div>
        <div className="flex items-center">
          <List size={16} className="mr-2 text-indigo-400" />
          <span>{event.event_category}</span>
        </div>
      </div>

      <p className="text-gray-400 text-sm flex-grow">
        {truncateDescription(event.event_description, 120)}
      </p>
    </div>
  );
}
