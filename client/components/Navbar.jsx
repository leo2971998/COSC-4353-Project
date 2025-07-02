import { useState } from "react";
import { Menu, X, Users } from "lucide-react";
import { Button } from "./ui/Button";
import { Link, useLocation } from "react-router-dom";

const devMode = {
  isLoggedIn: false,
  isProfileComplete: false,
};

export default function Navbar({ scrollToSection }) {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleScroll = (section) => {
    scrollToSection(section);
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="ml-3 text-xl font-semibold text-white">
              VolunteerHub
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {!devMode.isLoggedIn && (
              <>
                <Link
                  to="/"
                  onClick={(e) => {
                    if (location.pathname === "/") {
                      e.preventDefault();
                      handleScroll("hero");
                    }
                  }}
                  className="text-gray-300 hover:text-blue-400 font-medium transition"
                >
                  Home
                </Link>
                <Link
                  to="/"
                  onClick={(e) => {
                    if (location.pathname === "/") {
                      e.preventDefault();
                      handleScroll("about");
                    }
                  }}
                  className="text-gray-300 hover:text-blue-400 font-medium transition"
                >
                  About
                </Link>
                {/* Leo Nguyen - add login and register links */}
                <Link to="/login">
                  <Button className="text-gray-300 hover:text-blue-400 font-medium transition">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="text-gray-300 hover:text-blue-400 font-medium transition">
                    Register
                  </Button>
                </Link>
              </>
            )}

            {devMode.isLoggedIn && !devMode.isProfileComplete && (
              <>
                <Link
                  to="/"
                  onClick={(e) => {
                    if (location.pathname === "/") {
                      e.preventDefault();
                      handleScroll("hero");
                    }
                  }}
                  className="text-gray-300 hover:text-blue-400 font-medium transition"
                >
                  Home
                </Link>

                <Link
                  to="/complete-profile"
                  className="text-gray-300 hover:text-blue-400 font-medium transition"
                >
                  <Button>Complete Profile</Button>
                </Link>
                <Button className="text-gray-300 hover:text-red-400 transition">
                  Logout
                </Button>
              </>
            )}

            {devMode.isLoggedIn && devMode.isProfileComplete && (
              <>
                <Link
                  to="/"
                  onClick={(e) => {
                    if (location.pathname === "/") {
                      e.preventDefault();
                      handleScroll("hero");
                    }
                  }}
                  className="text-gray-300 hover:text-blue-400 font-medium transition"
                >
                  Home
                </Link>

                <Link
                  to="/dashboard"
                  className="text-gray-300 hover:text-blue-400 font-medium transition"
                >
                  Dashboard
                </Link>
                <Link
                  to="/history"
                  className="text-gray-300 hover:text-blue-400 font-medium transition"
                >
                  History
                </Link>
                <Button className="text-gray-300 hover:text-red-400 transition">
                  Logout
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-blue-400 transition"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-800 bg-gray-900">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {!devMode.isLoggedIn && location.pathname === "/" && (
                <>
                  <button
                    onClick={() => handleScroll("hero")}
                    className="block w-full text-left px-3 py-2 text-gray-300 hover:text-blue-400 hover:bg-gray-800 rounded-md"
                  >
                    Home
                  </button>
                  <button
                    onClick={() => handleScroll("about")}
                    className="block w-full text-left px-3 py-2 text-gray-300 hover:text-blue-400 hover:bg-gray-800 rounded-md"
                  >
                    About
                  </button>
                  {/* Leo Nguyen - add login and register links */}
                  <Link to="/login">
                    <Button className="w-full text-blue-400 hover:bg-blue-500/10">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className="w-full text-blue-400 hover:bg-blue-500/10">
                      Register
                    </Button>
                  </Link>
                </>
              )}

              {devMode.isLoggedIn && !devMode.isProfileComplete && (
                <>
                  <div className="space-y-2">
                    {/* Left-aligned items */}
                    <div className="flex flex-col">
                      <Link
                        to="/"
                        onClick={(e) => {
                          if (location.pathname === "/") {
                            e.preventDefault();
                            handleScroll("hero");
                          }
                        }}
                        className="block px-3 py-2 text-gray-300 hover:text-blue-400 hover:bg-gray-800 rounded-md"
                      >
                        Home
                      </Link>

                      <Link
                        to="/complete-profile"
                        className="block px-3 py-2 text-gray-300 hover:text-blue-400 hover:bg-gray-800 rounded-md"
                      >
                        Complete Profile
                      </Link>
                    </div>

                    {/* Centered logout */}
                    <div className="text-center">
                      <button className="text-red-400 hover:text-red-400 hover:bg-gray-800 px-3 py-2 rounded-md">
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}

              {devMode.isLoggedIn && devMode.isProfileComplete && (
                <>
                  <div className="space-y-2">
                    {/* Left-aligned items */}
                    <div className="flex flex-col">
                      <Link
                        to="/"
                        onClick={(e) => {
                          if (location.pathname === "/") {
                            e.preventDefault();
                            handleScroll("hero");
                          }
                        }}
                        className="block px-3 py-2 text-gray-300 hover:text-blue-400 hover:bg-gray-800 rounded-md"
                      >
                        Home
                      </Link>

                      <Link
                        to="/dashboard"
                        className="block px-3 py-2 text-gray-300 hover:text-blue-400 hover:bg-gray-800 rounded-md"
                      >
                        Dashboard
                      </Link>

                      <Link
                        to="/history"
                        className="block px-3 py-2 text-gray-300 hover:text-blue-400 hover:bg-gray-800 rounded-md"
                      >
                        History
                      </Link>
                    </div>

                    {/* Centered logout */}
                    <div className="text-center">
                      <button className="text-red-400 hover:text-red-400 hover:bg-gray-800 px-3 py-2 rounded-md">
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
