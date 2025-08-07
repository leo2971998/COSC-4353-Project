import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AdminEventReport() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = "https://cosc-4353-backend.vercel.app";

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/events`);
        const list = Array.isArray(data?.events) ? data.events : [];
        setEvents(list);
      } catch (err) {
        console.error("AdminEventReport fetchEvents error:", err);
        setError("Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const exportCSV = () => {
    const headers = ["Event Name", "Location", "Start Time", "End Time"];
    const rows = events.map((e) => [
      e.event_name,
      e.event_location,
      e.start_time,
      e.end_time,
    ]);
    const csvContent = [headers, ...rows]
      .map((r) => r.map((v) => `"${v ?? ""}"`).join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "event-report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Layout>
      <Navbar />
      <div className="pt-24 px-4">
        <h1 className="text-2xl font-bold mb-4">Event Report</h1>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <button
              onClick={exportCSV}
              className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Export CSV
            </button>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">Event</th>
                    <th className="px-4 py-2 text-left">Location</th>
                    <th className="px-4 py-2 text-left">Start</th>
                    <th className="px-4 py-2 text-left">End</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {events.map((ev) => (
                    <tr key={ev.event_id}>
                      <td className="px-4 py-2">{ev.event_name}</td>
                      <td className="px-4 py-2">{ev.event_location}</td>
                      <td className="px-4 py-2">{ev.start_time}</td>
                      <td className="px-4 py-2">{ev.end_time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
      <Footer />
    </Layout>
  );
}
