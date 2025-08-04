import { Clock } from 'lucide-react';

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
        <Clock className="w-5 h-5 text-purple-400 mr-2"/>
        <h2 className="text-xl font-semibold text-white">Event Time</h2>
      </div>
        
      <div className="space-y-6 grid grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Start Time
          </label>
          <input
            type="time"
            value={selectedStartTime}
            onChange={(e) => onStartTimeChange(e.target.value)}
            className="flex-1 px-8 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            End Time
          </label>
          <input
            type="time"
            value={selectedEndTime}
            onChange={(e) => onEndTimeChange(e.target.value)}
            className="flex-1 px-8 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    </div>
  );
}
