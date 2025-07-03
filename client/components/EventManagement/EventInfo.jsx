import { User } from "lucide-react";

export default function eventInfo({ eventName, error, onChange }) {
  return (
    <div>
      <div className="flex items-center mb-6">
        <User className="w-5 h-5 text-blue-400 mr-2" />
        <h2 className="text-xl font-semibold text-white">
          Event Management Information
        </h2>
      </div>

      <div className="space-y-6">
        <div>
          <label
            htmlFor="eventName"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Event Name *
          </label>
          <input
            type="text"
            id="fullName"
            value={eventName}
            onChange={(e) => onChange(e.target.value)}
            maxLength={50}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="(Event Name)"
          />
          {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
          <p className="mt-1 text-xs text-gray-500">
            {eventName.length}/50 characters
          </p>
        </div>
      </div>
    </div>
  );
}