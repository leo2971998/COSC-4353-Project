import { useEffect, useState, useCallback } from "react";
import axios from "axios";

import Layout           from "../components/Layout";
import Navbar           from "../components/Navbar";
import Footer           from "../components/Footer";
import CalendarView     from "../components/AdminDashboard/AdminCalendar.jsx";  // default import
import EventReportModal from "../components/AdminDashboard/EventReportModal.jsx";

const API_URL = "https://cosc-4353-backend.vercel.app";

export default function AdminPage() {
    const [allEvents, setAllEvents] = useState([]);
    const [reportOpen, setReportOpen] = useState(false);
    const currentUserId = Number(localStorage.getItem("userId") || 0);

    const fetchEvents = useCallback(async () => {
        try {
            const { data } = await axios.get(`${API_URL}/events`);
            if (!Array.isArray(data?.events)) throw new Error("Bad /events payload");

            const events = data.events.map((e) => ({
                date:    new Date(e.start_time),
                title:   e.event_name,
                details: e,
            }));
            setAllEvents(events);
        } catch (err) {
            console.error("fetchEvents:", err.message);
            setAllEvents([]);
        }
    }, []);

    useEffect(() => { fetchEvents(); }, [fetchEvents]);

    return (
        <Layout>
            <Navbar />
            <div className="pt-24 px-4">
                <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

                <button
                    onClick={() => setReportOpen(true)}
                    className="mb-6 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-white"
                >Generate Event Report</button>

                <CalendarView
                    allEvents={allEvents}
                    currentUserId={currentUserId}
                    refreshEvents={fetchEvents}
                />
            </div>
            <Footer />
            <EventReportModal open={reportOpen} onClose={()=>setReportOpen(false)}/>
        </Layout>
    );
}
