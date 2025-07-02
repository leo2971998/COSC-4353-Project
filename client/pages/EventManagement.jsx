import { useState } from "react";
import Header from "../components/CompleteProfile/Header";
import Navbar from "../components/Navbar";
import EventName from "../components/EventName";

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
            newErrors.requiredSKills = "Please select at least one skill";
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
        setFormData((prev) => ({
        ...prev,
        requiredSkills: prev.requiredSkills.includes(skill)
            ? prev.requiredSkills.filter((s) => s !== skill)
            : [...prev.requiredSkills, skill],
        }));
    };

    const handleDateAdd = () => {
        if (selectedDate && !manageData.eventDate.includes(selectedDate)) {
        setFormData((prev) => ({
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

                {/* Form Container */}
                
            </div>
        </>
    );
}