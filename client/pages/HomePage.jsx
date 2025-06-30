"use client";

import { useState } from "react";
import {
  Menu,
  X,
  Users,
  Calendar,
  Clock,
  Bell,
  ChevronDown,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Footer from "../components/Footer";

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navbar */}
      <Navbar scrollToSection={scrollToSection} />
      <Hero scrollToSection={scrollToSection} />
      <About />
      <Footer />
    </div>
  );
}
