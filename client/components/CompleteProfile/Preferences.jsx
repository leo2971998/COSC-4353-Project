export default function Preferences(formData, onChange) {
  return (
    <div>
      <label
        htmlFor="preferences"
        className="block text-sm font-medium text-gray-300 mb-2"
      >
        Additional Preferences
      </label>
      <textarea
        id="preferences"
        value={formData.preferences}
        onChange={(e) => onChange("preferences", e.target.value)}
        rows={4}
        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
        placeholder="Tell us about your volunteer preferences, any special requirements, or what causes are most important to you..."
      />
    </div>
  );
}
