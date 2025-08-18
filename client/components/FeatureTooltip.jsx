import { useState } from "react";
import { HelpCircle } from "lucide-react";

export default function FeatureTooltip({ title, description, className = "" }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="text-blue-400 hover:text-blue-300 transition-colors ml-2"
        aria-label={`Help: ${title}`}
      >
        <HelpCircle className="w-4 h-4" />
      </button>
      
      {isVisible && (
        <div className="absolute z-50 w-64 p-3 bg-gray-800 border border-gray-600 rounded-lg shadow-lg bottom-full left-1/2 transform -translate-x-1/2 mb-2">
          <div className="text-sm">
            <p className="text-blue-300 font-medium mb-1">{title}</p>
            <p className="text-gray-300">{description}</p>
          </div>
          {/* Arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
        </div>
      )}
    </div>
  );
}