// Israel Trejo - EventManagement Page
// - Sends event details to backend to be sent to the database
// - Code is consistent with CompleteProfile.jsx file

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EventHeader from "../components/EventManagement/EventHeader";
import Navbar from "../components/Navbar";
import Description from "../components/EventManagement/Description";
import EventInfo from "../components/EventManagement/EventInfo";
import Location from "../components/EventManagement/Location";
import SkillsSection from "../components/CompleteProfile/Skills";
import Urgency from "../components/EventManagement/Urgency";
import EventDate from "../components/EventManagement/EventDate"
import { Button } from "../components/ui/Button";

// Test to see if I can see changes in console:
console.log("Hello")

// Main Function:
export default function EventManagement(){
  const navigate = useNavigate();
  const API_URL = "http://localhost:3000";

  const [manageData, setManageData] = useState({
    // Event Features:
    eventName: "",
    eventDescription: "",
    location: "",
    skills: [],
    urgency: "",
    eventDate: [],
  });

  // --- Local UI State ---
  const [errors, setErrors] = useState({});
  const [isSkillsOpen, setIsSkillsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Hard-coded skill options for now. Replace with API later if needed.
  const skillOptions = [
    "Teaching & Education",
    "Healthcare & Medical",
    "Technology & IT",
    "Construction & Manual Labor",
    "Event Planning",
    "Marketing & Communications",
    "Food Service & Preparation",
    "Administrative Support",
    "Childcare & Youth Programs",
    "Senior Care",
    "Environmental & Conservation",
    "Arts & Creative",
    "Legal & Advocacy",
    "Transportation",
    "Language Translation",
    "Financial & Accounting",
  ];

  // Verifies that all event features are filled out:
  useEffect(() => {
    const changed =
      manageData.eventName ||
      manageData.eventDescription ||
      manageData.location ||
      manageData.skills.length > 0 ||
      manageData.urgency ||
      manageData.eventDate.length > 0;
    setHasUnsavedChanges(changed);
  }, [manageData]);

  // Warn on page unload if unsaved changes
  useEffect(() => {
      const handleBeforeUnload = (e) => {
        if (hasUnsavedChanges) {
          e.preventDefault();
          e.returnValue = ""; // Required to show browser prompt
        }
      };
      window.addEventListener("beforeunload", handleBeforeUnload);
      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
  }, [hasUnsavedChanges]);

  // Loading Event Details:
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    fetch(`${API_URL}/events/${userId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return;

          setManageData((prev) => ({
            ...prev,
            // prefer new backend alias -> fallback legacy fields -> keep existing
            eventName: data.eventName ?? "",
            eventDescription: data.eventDescription ?? "",
            location: data.location ?? "",
            skills: data.skills ? data.skills.split(/,\s*/) : [],
            urgency: data.urgency ?? "",
            eventDate: data.eventDate ? data.eventDate.split(/,\s*/): [],
          }));
      })
      .catch(() => {
        /* ignore load errors silently */
      });
  }, [API_URL]);

  // --- Change Handlers ---
  const handleInputChange = (field, value) => {
    const normalizedValue = field === "state" ? value.toUpperCase() : value;
    setManageData((prev) => ({
      ...prev,
      [field]: normalizedValue,
    }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSkillToggle = (skill) => {
    setManageData((prev) => ({
    ...prev,
      skills: prev.skills.includes(skill)
          ? prev.skills.filter((s) => s !== skill)
          : [...prev.skills, skill],
    }));
  };

  const handleDateAdd = () => {
    if (selectedDate && !manageData.eventDate.includes(selectedDate)) {
    setManageData((prev) => ({
        ...prev,
        eventDate: [...prev.eventDate, selectedDate],
    }));
    setSelectedDate("");
    }
  };

  const handleDateRemove = (dateToRemove) => {
    setManageData((prev) => ({
      ...prev,
      eventDate: prev.eventDate.filter((d) => d !== dateToRemove),
    }));
  };
    
  // --- Validation ---
  const validateForm = () => {
      const newErrors = {};

      if (!manageData.eventName.trim()){
          newErrors.eventName = "Event Name is required";
      } else if (manageData.eventName.length > 100){
          newErrors.eventName = "Event Name must be 100 characters or less";
      }

      if (!manageData.eventDescription.trim()){
          newErrors.eventDescription = "Event Description is required";
      }
      
      if (!manageData.location.trim()){
          newErrors.location = "Event Location is required";
      }

      if (manageData.skills.length === 0){
          newErrors.skills = "Please select at least one skill";
      }

      if (!manageData.urgency){
          newErrors.urgency = "Urgency is required";
      }
      
      if (manageData.eventDate.length === 0){
          newErrors.eventDate = "Please select at least one available date";
      }
      console.log("Validation Errors:", newErrors);
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  };

  // --- Backend Handling ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const userId = localStorage.getItem("userId"); // pull from storage
    if (!userId) { 
      alert("Please log in first"); 
      return; 
    }

    const payload = {
      userId,
      eventName: manageData.eventName,
      eventDescription: manageData.eventDescription,
      location: manageData.location,
      skills: manageData.skills.join(","), // convert array to string
      urgency: manageData.urgency,
      eventDate: manageData.eventDate.join(",") // convert array to string
    };
    console.log("1. Frontend: Sending Payload", payload);

    try {
      const res = await fetch(`${API_URL}/event-management/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      
      if (!res.ok) {
        console.error(data.message || "Event save failed");
        alert(data.message || "Event save failed");
        return;
      }

      // Saving Event flag & name locally
      localStorage.setItem("eventComplete", "true");
      setHasUnsavedChanges(false);
      navigate("/");
    } catch (err) {
      console.error("Error submitting event:", err);
      alert("Network Error: cound not save event");
    }
  };

  // --- Render ---
  return (
    <>
      <div className="min-h-screen bg-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <Navbar />
        <EventHeader />
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-900 rounded-3xl shadow-2xl border border-gray-700 p-8 sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Form Container */}
              <EventInfo
                eventName={manageData.eventName}
                error={errors.eventName}
                onChange={(value) => handleInputChange("eventName", value)}
              />

              <Description
                manageData={manageData}
                onChange={(value) => handleInputChange("eventDescription", value)}
              />

              <Location
                manageData={manageData}
                onChange={(value) => handleInputChange("location", value)}
              />

              <SkillsSection
                  skills={manageData.skills}
                  error={errors.skills}
                  onToggle={handleSkillToggle}
                  isOpen={isSkillsOpen}
                  setIsOpen={setIsSkillsOpen}
                  skillOptions={skillOptions}
              />

              <Urgency
                urgency={manageData.urgency}
                onChange={(e) =>
                  setManageData((prevData) => ({ ...prevData, urgency: e.target.value }))
                }
              />

              <EventDate
                eventDate={manageData.eventDate}
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                onAddDate={handleDateAdd}
                onRemoveDate={handleDateRemove}
                error={errors.eventDate}
              />
              <div className="pt-6">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 cursor-pointer hover:bg-gradient-to-r hover:from-blue-800 hover:to-purple-800 text-white py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                >
                  Create Event
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}