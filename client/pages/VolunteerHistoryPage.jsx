import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import TableCardDV from "../components/VolunteerHistory/TableCardDV";
import VHeader from "../components/VolunteerHistory/VHeader";
import VolunteerHistoryMain from "../components/VolunteerHistory/VolunteerHistoryMain";
import axios from "axios";

export default function VolunteerHistoryPage() {
  // This is mock data for right now
  const [volunteerHistory, setVolunteerHistory] = useState([]);

  const fetchvolHistory = async () => {
    try {
      const response = await axios.get("http://localhost:3000/history");
      setVolunteerHistory(response.data);
    } catch (error) {
      console.error("Failed to fetch volunteer history: ", error);
    }
  };

  useEffect(() => {
    fetchvolHistory();
  }, []);
  return (
    <>
      <div className="min-h-screen bg-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <Navbar />
        <VHeader />
        <VolunteerHistoryMain events={volunteerHistory} />
      </div>
    </>
  );
}
