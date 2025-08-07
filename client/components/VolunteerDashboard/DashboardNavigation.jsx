import { Calendar, List, History, Home } from "lucide-react";

export function DashboardNavigation({ activeSection, onSectionChange }) {
  const sections = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "my-events", label: "My Events", icon: Calendar },
    { id: "all-events", label: "Browse Events", icon: List },
    { id: "history", label: "History", icon: History },
  ];

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2">
        {sections.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onSectionChange(id)}
            aria-current={activeSection === id ? "page" : undefined}
            className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors border ${
              activeSection === id
                ? "bg-indigo-600 text-white border-indigo-500"
                : "bg-gray-800 text-gray-300 border-gray-700 hover:text-white hover:bg-gray-700"
            }`}
          >
            <Icon size={15} />
            <span className="ml-2">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
