import { Button } from "./ui/Button";
import { ChevronDown, Users, Shield } from "lucide-react";
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

        {/* Demo Access Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
          <Button
            onClick={() => navigate("/volunteer-demo")}
            size="lg"
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
          >
            <Users className="mr-2 w-5 h-5" />
            Try Volunteer Demo
          </Button>
          
          <Button
            onClick={() => navigate("/admin-demo")}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
          >
            <Shield className="mr-2 w-5 h-5" />
            Try Admin Demo
          </Button>
        </div>

        <Button
          onClick={() => scrollToSection("about")}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 mb-8"
        >
          Discover How It Works
          <ChevronDown className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </section>
  );
}
