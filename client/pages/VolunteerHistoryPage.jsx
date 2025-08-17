import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import VHeader from "../components/VolunteerHistory/VHeader";
import VolunteerHistoryMain from "../components/VolunteerHistory/VolunteerHistoryMain";
import axios from "axios";
import { API_URL } from "../api";

export default function VolunteerHistoryPage() {
  // This is mock data for right now
  const [volunteerHistory, setVolunteerHistory] = useState([]);

  // Fetches the data, makes a GET request to the backend path server/history <-- Calls the corresponding controller function there.
  // const fetchvolHistory = async () => {
  //   try {
  //     const response = await axios.get(`${API_URL}/history`);
  //     setVolunteerHistory(response.data);
  //   } catch (error) {
  //     console.error("Failed to fetch volunteer history: ", error);
  //   }
  // };

  const getVolunteerHistory = async () => {
    try {
      const userID = localStorage.getItem("userId");
      console.log(userID);
      const response = await axios.get(`${API_URL}/history/${userID}`);
      setVolunteerHistory(response.data.volunteer_history);
      console.log(volunteerHistory);
    } catch (error) {
      console.error("Failed to fetch history:", error);
    }
  };

  useEffect(() => {
    // fetchvolHistory();
    getVolunteerHistory();
  }, []);
  return (
    <>
      <div className="min-h-screen bg-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <VHeader />
        <VolunteerHistoryMain events={volunteerHistory} />
      </div>
    </>
  );
}
