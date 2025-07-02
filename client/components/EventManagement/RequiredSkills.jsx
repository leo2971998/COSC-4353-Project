import { ChevronDown, WrenchIcon, X } from "lucide-react";
import { Wrench } from 'lucide-react';

export default function RequiredSkills({
  skills,
  error,
  onToggle,
  isOpen,
  setIsOpen,
  skillOptions,
}) {
  return (
    <div>
      <div className="flex items-center mb-6">
        <Wrench className="w-5 h-5 text-green-400 mr-2" />
        <h2 className="text-xl font-semibold text-white">Event Skills</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Required Skills *
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 flex items-center justify-between"
            >
              <span className="text-gray-300">
                {skills.length === 0
                  ? "Select your skills"
                  : `${skills.length} skill${
                      skills.length !== 1 ? "s" : ""
                    } selected`}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isOpen && (
              <div className="absolute z-10 w-full mt-2 bg-gray-700 border border-gray-600 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                {skillOptions.map((skill) => (
                  <label
                    key={skill}
                    className="flex items-center px-4 py-3 hover:bg-gray-600 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={skills.includes(skill)}
                      onChange={() => onToggle(skill)}
                      className="w-4 h-4 text-blue-600 bg-gray-600 border-gray-500 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="ml-3 text-white">{skill}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {error && <p className="mt-2 text-sm text-red-400">{error}</p>}

          {skills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-600 text-white"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => onToggle(skill)}
                    className="ml-2 hover:text-gray-300"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}