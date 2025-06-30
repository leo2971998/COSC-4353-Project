import { Users } from "lucide-react";
export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="ml-2 text-lg font-semibold text-white">
              VolunteerHub
            </span>
          </div>
          <p className="text-gray-400 text-center md:text-right">
            © 2025 VolunteerHub. Connecting hearts, changing communities.
          </p>
        </div>
      </div>
    </footer>
  );
}
