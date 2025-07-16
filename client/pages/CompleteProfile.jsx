import Address from "../components/CompleteProfile/Address";
import Header from "../components/CompleteProfile/Header";
import PersonalInfo from "../components/CompleteProfile/PersonalInfo";
import SkillsSection from "../components/CompleteProfile/Skills";
import Footer from "../components/Footer";
import Layout from "../components/Layout";
import Navbar from "../components/Navbar";
import Preferences from "../components/CompleteProfile/Preferences";
import { STATES } from "../components/CompleteProfile/STATES";
import { Button } from "../components/ui/Button";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Availability from "../components/CompleteProfile/Availability";

export default function CompleteProfile() {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    skills: [],
    preferences: "",
    availability: [],
  });
  const API_URL =
    import.meta.env.VITE_API_URL || "https://localhost:3000";

  useEffect(() => {
    const changed =
      formData.fullName ||
      formData.address1 ||
      formData.skills.length > 0 ||
      formData.preferences ||
      formData.availability.length > 0;

    setHasUnsavedChanges(changed);
  }, [formData]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    fetch(`${API_URL}/profile/${userId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setFormData((prev) => ({
            ...prev,
            fullName: data.full_name || data.name || prev.fullName,
            address1: data.address1 || "",
            address2: data.address2 || "",
            city: data.city || "",
            state: data.state || "",
            zipCode: data.zip_code || "",
            skills: data.skills ? data.skills.split(/,\s*/) : [],
            preferences: data.preferences || "",
            availability: data.availability ? data.availability.split(/,\s*/) : [],
          }));
        }
      })
      .catch(() => {
        /* ignore errors */
      });
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (
        formData.fullName ||
        formData.address1 ||
        formData.skills.length > 0 ||
        formData.preferences ||
        formData.availability.length > 0
      ) {
        e.preventDefault();
        e.returnValue = ""; // Required to show browser prompt
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [formData]);

  // This is placeholder, we will pull this from the DB later on.
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Please log in first");
      return;
    }
    const payload = {
      userId,
      address1: formData.address1,
      address2: formData.address2,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
      skills: formData.skills.join(", "),
      preferences: formData.preferences,
      availability: formData.availability.join(", "),
    };
    try {
      const res = await fetch(`${API_URL}/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        console.error(data.message);
      } else {
        console.log(data.message);
        setHasUnsavedChanges(false);
        localStorage.setItem("profileComplete", "true");
        navigate("/");
      }
    } catch (err) {
      console.error("Error saving profile:", err);
    }
  };
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.length > 50) {
      newErrors.fullName = "Full name must be 50 characters or less";
    }

    if (!formData.address1.trim()) {
      newErrors.address1 = "Address is required";
    } else if (formData.address1.length > 100) {
      newErrors.address1 = "Address must be 100 characters or less";
    }

    if (formData.address2.length > 100) {
      newErrors.address2 = "Address 2 must be 100 characters or less";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    } else if (formData.city.length > 100) {
      newErrors.city = "City must be 100 characters or less";
    }

    if (!formData.state) {
      newErrors.state = "State is required";
    }

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = "Zip code is required";
    } else if (formData.zipCode.length < 5 || formData.zipCode.length > 9) {
      newErrors.zipCode = "Zip code must be 5-9 characters";
    }

    if (formData.skills.length === 0) {
      newErrors.skills = "Please select at least one skill";
    }

    if (formData.availability.length === 0) {
      newErrors.availability = "Please select at least one available date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSkillToggle = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handleDateAdd = () => {
    if (selectedDate && !formData.availability.includes(selectedDate)) {
      setFormData((prev) => ({
        ...prev,
        availability: [...prev.availability, selectedDate],
      }));
      setSelectedDate("");
    }
  };

  const handleDateRemove = (dateToRemove) => {
    setFormData((prev) => ({
      ...prev,
      availability: prev.availability.filter((date) => date !== dateToRemove),
    }));
  };
  return (
    <>
      <div className="min-h-screen bg-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <Navbar />
        <Header />

        {/* Form Container */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-900 rounded-3xl shadow-2xl border border-gray-700 p-8 sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <PersonalInfo
                fullName={formData.fullName}
                error={errors.fullName}
                onChange={(value) => handleInputChange("fullName", value)}
              />

              <Address
                formData={formData}
                errors={errors}
                onChange={handleInputChange}
                states={STATES}
              />
              <SkillsSection
                skills={formData.skills}
                error={errors.skills}
                onToggle={handleSkillToggle}
                isOpen={isSkillsOpen}
                setIsOpen={setIsSkillsOpen}
                skillOptions={skillOptions}
              />
              <Preferences
                formData={formData}
                onChange={(value) => handleInputChange("preferences", value)}
              />
              <Availability
                availability={formData.availability}
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                onAddDate={handleDateAdd}
                onRemoveDate={handleDateRemove}
                error={errors.availability}
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
