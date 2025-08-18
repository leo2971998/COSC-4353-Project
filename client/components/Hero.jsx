import { Button } from "./ui/Button";
import { ChevronDown, Monitor, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Hero({ scrollToSection }) {
  const navigate = useNavigate();

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20"></div>

      {/* Abstract background shapes */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          Join the Mission.{" "}
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Make an Impact.
          </span>
        </h1>

        <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
          Help local communities by volunteering based on your skills,
          interests, and availability.
        </p>

        <Button
          onClick={() => scrollToSection("about")}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 mb-8"
        >
          Discover How It Works
          <ChevronDown className="ml-2 w-5 h-5" />
        </Button>

        {/* Demo Section */}
        <div className="mt-8 pt-8 border-t border-gray-700/50">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Experience the Platform
          </h2>
          <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
            Try our interactive demos to see how volunteers and administrators use the platform
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={() => navigate("/volunteer-demo")}
              size="lg"
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-green-500/30"
            >
              <Users className="mr-2 w-5 h-5" />
              Volunteer Demo
            </Button>
            
            <Button
              onClick={() => navigate("/admin-demo")}
              size="lg"
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-6 py-3 font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-amber-500/30"
            >
              <Monitor className="mr-2 w-5 h-5" />
              Admin Demo
            </Button>
          </div>
          
          <p className="text-sm text-gray-400 mt-4">
            🎯 Demo Mode - Explore with sample data, no real account needed
          </p>
        </div>
      </div>
    </section>
  );
}
