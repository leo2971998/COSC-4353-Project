import { useEffect, useState } from "react";
import VolunteerHistoryMain from "../VolunteerHistory/VolunteerHistoryMain";
import axios from "axios";
import { API_URL } from "../../api";

export function VolunteerHistory() {
  const [volunteerHistory, setVolunteerHistory] = useState([]);

  const getVolunteerHistory = async () => {
    try {
      const userID = localStorage.getItem("userId");
      const response = await axios.get(`${API_URL}/history/${userID}`);
      setVolunteerHistory(response.data.volunteer_history || []);
    } catch (error) {
      console.error("Failed to fetch history:", error);
    }
  };

  useEffect(() => {
    getVolunteerHistory();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Volunteer History</h2>
      <VolunteerHistoryMain events={volunteerHistory} />
    </div>
  );
}
