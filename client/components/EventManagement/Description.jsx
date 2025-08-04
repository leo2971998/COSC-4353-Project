export default function Description({ manageData = {}, onChange }){
  return (
    <div>
      <label
        htmlFor="description"
        className="block text-sm font-medium text-gray-300 mb-2"
      >
        Event Description *
      </label>
      <textarea
        id="description"
        value={manageData.event_description || ""}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
        placeholder="Describe the event's mission, goals, or other relevent and important information volunteers need to know..."
      />
    </div>
  );
}