import { AlertTriangle} from "lucide-react";

export default function Urgency({ 
    urgency,
    onChange,
    error
}){
    return (
        
        <div>
            <div className="flex items-center mb-6">
                <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
                <h2 className="text-xl font-semibold text-white">Event Urgency</h2>
            </div>

            <div className="space-y-6">
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
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                    {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
                </div>
            </div>
        </div>
    );
}