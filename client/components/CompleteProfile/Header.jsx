import { Users } from "lucide-react";

export default function Header() {
  return (
    <div className="max-w-2xl mx-auto pt-8 sm:pt-12 lg:pt-16 mb-8">
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Complete Your Profile
        </h1>
        <p className="text-lg text-gray-300">
          Help us match you with the perfect volunteer opportunities by sharing
          a bit about yourself.
        </p>
      </div>
    </div>
  );
}
