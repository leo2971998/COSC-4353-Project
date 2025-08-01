// Leo Nguyen – CompleteProfile page (full updated component)
// - Loads profile (includes fullName from backend alias).
// - Sends fullName in POST so login.full_name is updated.
// - Defensive fallbacks for legacy field names (full_name, name, zip_code).
// - Unsaved-changes browser prompt.
// - Consistent Layout/Header/Footer wrapper.

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../components/Layout";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import Header from "../components/CompleteProfile/Header";
import PersonalInfo from "../components/CompleteProfile/PersonalInfo";
import Address from "../components/CompleteProfile/Address";
import SkillsSection from "../components/CompleteProfile/Skills";
import Preferences from "../components/CompleteProfile/Preferences";
import Availability from "../components/CompleteProfile/Availability";
import { STATES } from "../components/CompleteProfile/STATES";
import { Button } from "../components/ui/Button";

export default function CompleteProfile() {
  const navigate = useNavigate();
  const API_URL = "https://cosc-4353-backend.vercel.app"; // no trailing slash

  // --- Form State ---
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

  // --- Local UI State ---
  const [errors, setErrors] = useState({});
  const [isSkillsOpen, setIsSkillsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [skillOptions, setSkillOptions] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/skills`)
        .then((res) => (res.ok ? res.json() : Promise.resolve([])))
        .then((data) => {
          if (Array.isArray(data)) setSkillOptions(data);
        })
        .catch(() => {});
  }, [API_URL]);

  // Track unsaved change state
  useEffect(() => {
    const changed =
        formData.fullName ||
        formData.address1 ||
        formData.address2 ||
        formData.city ||
        formData.state ||
        formData.zipCode ||
        formData.skills.length > 0 ||
        formData.preferences ||
        formData.availability.length > 0;
    setHasUnsavedChanges(changed);
  }, [formData]);

  // Warn on page unload if unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = ""; // Chrome requires returnValue to show prompt
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Load existing profile
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    fetch(`${API_URL}/profile/${userId}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (!data) return;

          setFormData((prev) => ({
            ...prev,
            // prefer new backend alias → fallback legacy fields → keep existing
            fullName:
                data.fullName ??
                data.full_name ??
                data.name ??
                prev.fullName,
            address1: data.address1 ?? "",
            address2: data.address2 ?? "",
            city: data.city ?? "",
            state: data.state ?? "",
            zipCode: data.zipCode ?? data.zip_code ?? "",
            skills: Array.isArray(data.skills)
                ? data.skills
                : data.skills
                    ? data.skills.split(/,\s*/)
                    : [],
            preferences: data.preferences ?? "",
            availability: data.availability ? data.availability.split(/,\s*/) : [],
          }));
        })
        .catch(() => {
          /* ignore load errors silently */
        });
  }, [API_URL]);

  // --- Change Handlers ---
  const handleInputChange = (field, value) => {
    const normalizedValue = field === "state" ? value.toUpperCase() : value;
    setFormData((prev) => ({
      ...prev,
      [field]: normalizedValue,
    }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSkillToggle = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
          ? prev.skills.filter((s) => s !== skill)
          : [...prev.skills, skill],
    }));
    if (errors.skills) {
      setErrors((prev) => ({ ...prev, skills: "" }));
    }
  };

  const handleDateAdd = () => {
    if (selectedDate && !formData.availability.includes(selectedDate)) {
      setFormData((prev) => ({
        ...prev,
        availability: [...prev.availability, selectedDate],
      }));
      setSelectedDate("");
      if (errors.availability) {
        setErrors((prev) => ({ ...prev, availability: "" }));
      }
    }
  };

  const handleDateRemove = (dateToRemove) => {
    setFormData((prev) => ({
      ...prev,
      availability: prev.availability.filter((d) => d !== dateToRemove),
    }));
  };

  // --- Validation ---
  const validateForm = () => {
    const newErrors = {};

    // NOTE: UI cap (50) < DB cap (255). Adjust if you want parity.
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
    } else if (formData.state.length > 2) {
      newErrors.state = "Use 2‑letter state code";
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

  // --- Submit ---
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
      fullName: formData.fullName, // <-- send so backend updates login.full_name
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
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        console.error(data.message || "Profile save failed");
        alert(data.message || "Profile save failed");
        return;
      }

      // Save profileComplete flag & name locally
      localStorage.setItem("profileComplete", "true");
      if (formData.fullName) {
        localStorage.setItem("fullName", formData.fullName);
        // also patch into stored user object if exists
        try {
          const userStr = localStorage.getItem("user");
          if (userStr) {
            const u = JSON.parse(userStr);
            u.fullName = formData.fullName;
            localStorage.setItem("user", JSON.stringify(u));
          }
        } catch {
          /* ignore */
        }
      }

      setHasUnsavedChanges(false);
      navigate("/");
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("Network error: could not save profile");
    }
  };

  // --- Render ---
  return (
      <Layout>
        <Navbar />
        <div className="min-h-screen bg-gray-800 py-12 px-4 sm:px-6 lg:px-8">
          <Header />
          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-900 rounded-3xl shadow-2xl border border-gray-700 p-8 sm:p-10">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <PersonalInfo
                    fullName={formData.fullName}
                    error={errors.fullName}
                    onChange={(v) => handleInputChange("fullName", v)}
                />

                {/* Address */}
                <Address
                    formData={formData}
                    errors={errors}
                    onChange={handleInputChange}
                    states={STATES}
                />

                {/* Skills */}
                <SkillsSection
                    skills={formData.skills}
                    error={errors.skills}
                    onToggle={handleSkillToggle}
                    isOpen={isSkillsOpen}
                    setIsOpen={setIsSkillsOpen}
                    skillOptions={skillOptions}
                />

                {/* Preferences */}
                <Preferences
                    formData={formData}
                    onChange={(v) => handleInputChange("preferences", v)}
                />

                {/* Availability */}
                <Availability
                    availability={formData.availability}
                    selectedDate={selectedDate}
                    onDateChange={setSelectedDate}
                    onAddDate={handleDateAdd}
                    onRemoveDate={handleDateRemove}
                    error={errors.availability}
                />

                {/* Submit */}
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
        <Footer />
      </Layout>
  );
}
