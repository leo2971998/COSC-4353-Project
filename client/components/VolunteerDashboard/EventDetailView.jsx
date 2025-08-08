import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Settings,
  List,
  ArrowLeft,
} from "lucide-react";

export function EventDetailView({ event, onBack, onEnroll }) {
  if (!event) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No event selected.</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
        >
          Back to Browse
        </button>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const skillsArray = Array.isArray(event.skills)
    ? event.skills
    : typeof event.skills === "string" && event.skills.length
    ? event.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="bg-gray-900 rounded-lg p-8 border border-gray-700">
      <button
        onClick={onBack}
        className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Browse Events
      </button>

      <h1 className="text-3xl font-bold text-white mb-2">{event.event_name}</h1>
      <div className="flex items-center text-gray-300 mb-6">
        <MapPin size={18} className="mr-2 text-indigo-400" />
        <span>{event.event_location}</span>
      </div>

      {!event.event_status || event.event_status === "Withdrew" ? (
        <button
          onClick={() => onEnroll(event.event_id, event.event_name)}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200 mb-8"
        >
          Enroll Now
        </button>
      ) : (
        <div className="w-full mb-8 text-center">
          <span className="inline-block bg-green-700 text-white px-4 py-2 rounded">
            Already Enrolled
          </span>
        </div>
      )}

      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">
            Event Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
            <div className="flex items-center">
              <Calendar size={16} className="mr-2 text-indigo-400" />
              <span>Date: {formatDate(event.start_time)}</span>
            </div>
            <div className="flex items-center">
              <Clock size={16} className="mr-2 text-indigo-400" />
              <span>
                Time: {formatTime(event.start_time)} -{" "}
                {formatTime(event.end_time)}
              </span>
            </div>
            <div className="flex items-center">
              <Settings size={16} className="mr-2 text-indigo-400" />
              <span>
                Skills: {skillsArray.length ? skillsArray.join(", ") : "N/A"}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-4">
            Event Description
          </h2>
          <p className="text-gray-400 leading-relaxed">
            {event.event_description}
          </p>
        </div>

        {skillsArray.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">
              Required Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {skillsArray.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
