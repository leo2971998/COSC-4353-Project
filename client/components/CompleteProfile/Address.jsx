import { MapPin } from "lucide-react";

export default function Address({ formData, errors, onChange, states }) {
  return (
    <div>
      <div className="flex items-center mb-6">
        <MapPin className="w-5 h-5 text-purple-400 mr-2" />
        <h2 className="text-xl font-semibold text-white">Address</h2>
      </div>

      <div className="space-y-6">
        {/* Address 1 */}
        <div>
          <label
            htmlFor="address1"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Address Line 1 *
          </label>
          <input
            type="text"
            id="address1"
            value={formData.address1}
            onChange={(e) => onChange("address1", e.target.value)}
            maxLength={100}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Street address"
          />
          {errors.address1 && (
            <p className="mt-2 text-sm text-red-400">{errors.address1}</p>
          )}
        </div>

        {/* Address 2 */}
        <div>
          <label
            htmlFor="address2"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Address Line 2
          </label>
          <input
            type="text"
            id="address2"
            value={formData.address2}
            onChange={(e) => onChange("address2", e.target.value)}
            maxLength={100}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Apartment, suite, etc. (optional)"
          />
          {errors.address2 && (
            <p className="mt-2 text-sm text-red-400">{errors.address2}</p>
          )}
        </div>

        {/* City, State, Zip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* City */}
          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              City *
            </label>
            <input
              type="text"
              id="city"
              value={formData.city}
              onChange={(e) => onChange("city", e.target.value)}
              maxLength={100}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="City"
            />
            {errors.city && (
              <p className="mt-2 text-sm text-red-400">{errors.city}</p>
            )}
          </div>

          {/* State */}
          <div>
            <label
              htmlFor="state"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              State *
            </label>
            <select
              id="state"
              value={formData.state}
              onChange={(e) => onChange("state", e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state.code} value={state.code}>
                  {state.name}
                </option>
              ))}
            </select>
            {errors.state && (
              <p className="mt-2 text-sm text-red-400">{errors.state}</p>
            )}
          </div>

          {/* Zip Code */}
          <div>
            <label
              htmlFor="zipCode"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Zip Code *
            </label>
            <input
              type="text"
              id="zipCode"
              value={formData.zipCode}
              onChange={(e) => onChange("zipCode", e.target.value)}
              maxLength={9}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="12345"
            />
            {errors.zipCode && (
              <p className="mt-2 text-sm text-red-400">{errors.zipCode}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
