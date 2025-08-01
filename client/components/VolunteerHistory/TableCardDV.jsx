import {
  Calendar,
  MapPin,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

export default function VolunteerHistoryTableRow({ event }) {
  const getStatusBadge = (status) => {
    if (!status || typeof status !== "string") return "";
    const base =
      "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium";
    switch (status.toLowerCase()) {
      case "attended":
        return `${base} bg-green-600/20 text-green-400 border border-green-600/30`;
      case "missed":
        return `${base} bg-red-600/20 text-red-400 border border-red-600/30`;
      case "signed up":
        return `${base} bg-blue-600/20 text-blue-400 border border-blue-600/30`;
      default:
        return `${base} bg-gray-600/20 text-gray-400 border border-gray-600/30`;
    }
  };

  const getUrgencyBadge = (urgency) => {
    if (!urgency || typeof urgency !== "string") return "";
    const base =
      "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium";
    switch (urgency.toLowerCase()) {
      case "high":
        return `${base} bg-red-500/20 text-red-400`;
      case "medium":
        return `${base} bg-yellow-500/20 text-yellow-400`;
      case "low":
        return `${base} bg-green-500/20 text-green-400`;
      default:
        return `${base} bg-gray-500/20 text-gray-400`;
    }
  };

  const getStatusIcon = (status) => {
    if (!status || typeof status !== "string") return "";
    switch (status.toLowerCase()) {
      case "attended":
        return <CheckCircle className="w-4 h-4 mr-1" />;
      case "missed":
        return <XCircle className="w-4 h-4 mr-1" />;
      case "signed up":
        return <Clock className="w-4 h-4 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <tr className="hover:bg-gray-700/30 transition-all duration-200 group">
      {/* Event Details */}
      <td className="px-6 py-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors duration-200">
            {event.event_name}
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed max-w-md">
            {event.event_description}
          </p>
        </div>
      </td>

      {/* Location & Skills */}
      <td className="px-6 py-6">
        <div className="space-y-3">
          <div className="flex items-start">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
            <span className="text-sm text-gray-300">
              {event.event_location}
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {event.skills.split(",").map((skill, idx) => (
              <span
                key={idx}
                className="inline-block px-2 py-1 bg-gray-600/50 text-gray-300 text-xs rounded-md"
              >
                {skill.trim()}
              </span>
            ))}
            {event.skills.split(",").length > 2 && (
              <span className="inline-block px-2 py-1 bg-gray-600/50 text-gray-300 text-xs rounded-md">
                +{event.skills.split(",").length - 2} more
              </span>
            )}
          </div>
        </div>
      </td>

      {/* Date & Urgency */}
      <td className="px-6 py-6">
        <div className="space-y-3">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 text-gray-400 mr-2" />
            <span className="text-sm text-gray-300">
              {new Date(event.start_time).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
          <div className={getUrgencyBadge(event.urgency)}>
            <AlertTriangle className="w-3 h-3 mr-1" />
            {event.urgency}
          </div>
        </div>
      </td>

      {/* Status */}
      <td className="px-6 py-6">
        <div className={getStatusBadge(event.event_status)}>
          {getStatusIcon(event.event_status)}
          {event.event_status}
        </div>
      </td>
    </tr>
  );
}
