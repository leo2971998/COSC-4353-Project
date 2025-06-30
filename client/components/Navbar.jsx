// src/components/Navbar.jsx
"use client";

import { useState } from "react";
import { Menu, X, Users } from "lucide-react";
import { Button } from "../components/ui/Button";

export default function Navbar({ scrollToSection }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleScroll = (id) => {
    scrollToSection(id);
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo placeholder */}
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
            <button
              onClick={() => handleScroll("hero")}
              className="text-gray-300 hover:text-blue-400 transition-colors duration-200 font-medium"
            >
              Home
            </button>
            <button
              onClick={() => handleScroll("about")}
              className="text-gray-300 hover:text-blue-400 transition-colors duration-200 font-medium"
            >
              About
            </button>
            <Button
              variant="outline"
              className="border-blue-500 text-blue-400 hover:bg-blue-500/10 bg-transparent hover:text-blue-300"
            >
              Login
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-blue-400 transition-colors duration-200"
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
              <button
                onClick={() => handleScroll("hero")}
                className="block w-full text-left px-3 py-2 text-gray-300 hover:text-blue-400 hover:bg-gray-800 rounded-md transition-colors duration-200 font-medium"
              >
                Home
              </button>
              <button
                onClick={() => handleScroll("about")}
                className="block w-full text-left px-3 py-2 text-gray-300 hover:text-blue-400 hover:bg-gray-800 rounded-md transition-colors duration-200 font-medium"
              >
                About
              </button>
              <div className="px-3 py-2">
                <Button
                  variant="outline"
                  className="w-full border-blue-500 text-blue-400 hover:bg-blue-500/10 bg-transparent hover:text-blue-300"
                >
                  Login
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
