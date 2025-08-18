import { Button } from "./ui/Button";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Hero({ scrollToSection }) {
  const navigate = useNavigate();

  const demoLogin = (role) => {
    const demoUser =
      role === "admin"
        ? { id: 1, role: "admin", fullName: "Demo Admin" }
        : { id: 2, role: "volunteer", fullName: "Demo Volunteer" };
    localStorage.setItem("user", JSON.stringify(demoUser));
    localStorage.setItem("userId", String(demoUser.id));
    localStorage.setItem("fullName", demoUser.fullName);
    localStorage.setItem("profileComplete", "true");
    localStorage.setItem("isLoggedIn", "true");
    navigate(role === "admin" ? "/admin-demo" : "/volunteer-demo");
  };
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
        <div className="mt-8 p-6 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 max-w-2xl mx-auto">
          <h3 className="text-2xl font-semibold text-white mb-3">
            Try a Live Demo
          </h3>
          <p className="text-gray-300 mb-6">
            Experience our platform instantly with pre-loaded demo data
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => demoLogin("admin")}
              className="bg-gradient-to-r from-amber-600 to-pink-600 hover:from-amber-700 hover:to-pink-700 text-white py-3 px-6 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Admin Demo
              <span className="block text-sm opacity-80">Manage events & users</span>
            </Button>
            <Button
              onClick={() => demoLogin("volunteer")}
              className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white py-3 px-6 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Volunteer Demo
              <span className="block text-sm opacity-80">Browse & join events</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
