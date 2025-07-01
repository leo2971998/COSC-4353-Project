import { useState } from "react";

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
}