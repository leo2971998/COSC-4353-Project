// pages/AdminPage.jsx
// Leo Nguyen – added “Generate Event Report” button + modal

import { useEffect, useState } from "react";
import axios from "axios";

import Layout           from "../components/Layout";
import Navbar           from "../components/Navbar";
import Footer           from "../components/Footer";
import { CalendarView } from "../components/AdminDashboard/AdminCalendar.jsx";
import EventReportModal from "../components/AdminDashboard/EventReportModal.jsx"; // ★ new

export default function AdminPage() {
    /* ------- state ------- */
    const [allEvents,     setAllEvents]   = useState([]);
    const [upcomingEvents,setUpcoming]    = useState([]);
    const [reportOpen,    setReportOpen]  = useState(false);            // ★ new

    const currentUserId = Number(localStorage.getItem("userId") || 0);
    const API_URL = "https://cosc-4353-backend.vercel.app";

    /* ------- fetch events once ------- */
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/events`);
                if (!Array.isArray(data?.events)) throw new Error("Bad /events payload");

                const events = data.events.map((e) => ({
                    date:    new Date(e.start_time),
                    title:   e.event_name,
                    details: e,
                }));

                setAllEvents(events);
                setUpcoming(events
                    .filter((e) => e.date >= new Date())
                    .sort((a, b) => a.date - b.date));
            } catch (err) {
                console.error("Admin fetchEvents error:", err.message);
                setAllEvents([]);
                setUpcoming([]);
            }
        };

        fetchEvents();
    }, []);

    /* ------- UI ------- */
    return (
        <Layout>
            <Navbar />
            <div className="pt-24 px-4">
                <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

                {/* Leo Nguyen – report trigger */}
                <button
                    onClick={() => setReportOpen(true)}
                    className="mb-6 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-white"
                >
                    Generate Event Report
                </button>

                <CalendarView
                    isAdmin={true}
                    currentUserId={currentUserId}
                    allEvents={allEvents}
                    upcomingEvents={upcomingEvents}
                />
            </div>
            <Footer />

            {/* report modal */}
            <EventReportModal open={reportOpen} onClose={() => setReportOpen(false)} />
        </Layout>
    );
}
