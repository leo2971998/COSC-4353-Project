import { Clock, Plus, X } from "lucide-react";
import { Button } from "../ui/Button";

export default function EventTime({
  selectedStartTime,
  selectedEndTime,
  onStartTimeChange,
  onEndTimeChange,
  error,
}) {
  return (
    <div>
      <div className="flex items-center mb-6">
        <Clock className="w-5 h-5 text-orange-400 mr-2" />
        <h2 className="text-xl font-semibold text-white">Event Time</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Start Time and End Time *
          </label>

          <div className="flex gap-2">
            <input
              type="time"
              value={selectedStartTime}
              onChange={(e) => onStartTimeChange(e.target.value)}
              className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <input
              type="time"
              value={selectedEndTime}
              onChange={(e) => onEndTimeChange(e.target.value)}
              className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <Button
              type="button"
              onClick={onAddTime}
              disabled={!selectedStartTime || !selectedEndTime}
              className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>

          {error && <p className="mt-2 text-sm text-red-400">{error}</p>}

          {eventTimes.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-300 mb-2">Selected time ranges:</p>
              <div className="flex flex-wrap gap-2">
                {eventTimes.map(({ start, end }, index) => (
                  <span
                    key={`${start}-${end}-${index}`}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-600 text-white"
                  >
                    {start} - {end}
                    <button
                      type="button"
                      onClick={() => onRemoveTime(index)}
                      className="ml-2 hover:text-gray-300"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
