import { useState } from "react";
import { AlertTriangle, ChevronDown } from "lucide-react";

export default function Urgency({
  urgency,
  onChange,
  error,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const urgencyOptions = ["Low", "Medium", "High"];

  const handleSelect = (value) => {
    onChange({ target: { value } });
    setIsOpen(false);
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
        <h2 className="text-xl font-semibold text-white">Event Urgency</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Urgency *
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 flex items-center justify-between"
            >
            {/* IF I DON'T LIKE IT LATER, THEN CHANGE BELOW TO 'text-gray-300' */}
              <span className="text-white"> 
                {urgency ? urgency : "Select Urgency"}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isOpen && (
              <div className="absolute z-10 w-full mt-2 bg-gray-700 border border-gray-600 rounded-xl shadow-lg">
                {urgencyOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-600 text-white ${
                      urgency === option ? "bg-gray-600" : ""
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
          {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        </div>
      </div>
    </div>
  );
}