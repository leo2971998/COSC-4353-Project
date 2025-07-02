import { useState, useEffect } from "react";
import Header from "../components/CompleteProfile/Header";
import Navbar from "../components/Navbar";
import Description from "../components/EventManagement/Description";
import EventInfo from "../components/EventManagement/EventInfo";
import Address from "../components/CompleteProfile/Address";
import SkillsSection from "../components/CompleteProfile/Skills";
import Urgency from "../components/EventManagement/Urgency";
import Availability from "../components/CompleteProfile/Availability";
import { STATES } from "../components/CompleteProfile/STATES";
import { Button } from "../components/ui/Button";

// Test to see if I can see changes in console:
console.log("Hello")

// Main Function:
export default function EventManagement(){

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [manageData, setManageData] = useState({
    // Event Features:
    eventName: "",
    eventDescription: "",
    location: "",
    requiredSkills: [],
    urgency: "",
    eventDate: [],
  });

  useEffect(() => {
    // Verifies that all event features are filled out:
    const changed =
      manageData.eventName ||
      manageData.eventDescription ||
      manageData.location ||
      manageData.requiredSkills.length > 0 ||
      manageData.urgency ||
      manageData.eventDate.length > 0;
    setHasUnsavedChanges(changed);
  }, [manageData]);

    useEffect(() => {
        const handleBeforeUnload = (e) => {
          if (
            manageData.eventName ||
            manageData.eventDescription ||
            manageData.location ||
            manageData.requiredSkills.length > 0 ||
            manageData.urgency ||
            manageData.eventDate.length > 0
          ) {
            e.preventDefault();
            e.returnValue = ""; // Required to show browser prompt
          }
        };
    
        window.addEventListener("beforeunload", handleBeforeUnload);
    
        return () => {
          window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [manageData]);

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

    const [errors, setErrors] = useState({});
    const [isSkillsOpen, setIsSkillsOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState("");

    const handleInputChange = (field, value) => {
      const normalizedValue = field === "state" ? value.toUpperCase() : value;
      setFormData((prev) => ({
        ...prev,
        [field]: normalizedValue,
      }));

      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: "",
        }));
      }
    };

    const handleUrgencyToggle = () => {
      console.log("Urgency toggled");
    };

    const handleDateRemove = (date) => {
      console.log("Removed date:", date);
    };

    const [isUrgencyOpen, setIsUrgencyOpen] = useState(false);

    const urgencyOptions = ["Low", "Medium", "High"];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
        // Make a POST request to the backend storing this info in the database.
        console.log("Form submitted: ", formData);
        }
    };

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

        if (manageData.requiredSkills.length === 0){
            newErrors.requiredSkills = "Please select at least one skill";
        }

        if (!manageData.urgency){
            newErrors.urgency = "Urgency is required";
        }
        
        if (manageData.eventDate.length === 0){
            newErrors.eventDate = "Please select at least one available date";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSkillToggle = (skill) => {
        setManageData((prev) => ({
        ...prev,
        requiredSkills: prev.requiredSkills.includes(skill)
            ? prev.requiredSkills.filter((s) => s !== skill)
            : [...prev.requiredSkills, skill],
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

    return (
      <>
        <div className="min-h-screen bg-gray-800 py-12 px-4 sm:px-6 lg:px-8">
          <Navbar />
          <Header />
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
                  eventDescription={manageData.eventDescription}
                  error={errors.eventDescription}
                  onChange={(value) => handleInputChange("description", value)}
                />

                <Address
                  manageData={manageData}
                  errors={errors}
                  onChange={handleInputChange}
                  states={STATES}
                />

                <SkillsSection
                  skills={manageData.requiredSkills}
                  error={errors.requiredSkills}
                  onToggle={handleSkillToggle}
                  isOpen={isSkillsOpen}
                  setIsOpen={setIsSkillsOpen}
                  skillOptions={skillOptions}
                />

                <Urgency
                  manageData={manageData}
                  error={errors.skills}
                  onToggle={handleUrgencyToggle}
                  isOpen={setIsUrgencyOpen}
                  urgencyOptions={urgencyOptions}
                />

                <Availability
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
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    Complete Profile
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </>
    );
}