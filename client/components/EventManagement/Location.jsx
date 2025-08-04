export default function Location({ manageData={}, onChange }){
    return(
        <div>
            <label
                html="event_location"
                className="block text-sm font-medium text-gray-300 mb-2"
            >
                Location *
            </label>
            <textarea
                id="event_location"
                value={manageData.event_location || ""}
                onChange={(e) => onChange(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                placeholder="(Event Description)"
            />
        </div>
    );
}