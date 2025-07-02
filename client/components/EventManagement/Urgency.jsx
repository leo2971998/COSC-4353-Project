export default function Urgency({ urgency, onChange }){
    return (
        <div>
            <label
                html="urgency"
                className="block text-sm font-medium text-gray-300 mb-2"
            >
                Urgency *
            </label>
            <select
                id="urgency"
                name="urgency"
                value={urgency}
                onChange={onChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
            >
                <option value="">Select Urgency</option>
                <option value="Calm">Calm</option>
                <option value="Moderate">Moderate</option>
                <option value="Severe">Severe</option>
            </select>
        </div>
    );
}