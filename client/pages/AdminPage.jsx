import { useEffect, useState, useCallback } from "react";
import axios from "axios";

import Layout from "../components/Layout";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CalendarView from "../components/AdminDashboard/AdminCalendar.jsx";       // default import
import EventReportModal from "../components/AdminDashboard/EventReportModal.jsx"; // existing (Events / Requests)
import VolunteerActivityReportModal from "../components/AdminDashboard/VolunteerActivityReportModal.jsx"; // NEW

const API_URL = "https://cosc-4353-backend.vercel.app";

export default function AdminPage() {
    const [allEvents, setAllEvents] = useState([]);
    const [reportOpen, setReportOpen] = useState(false);       // Events/Requests report
    const [activityOpen, setActivityOpen] = useState(false);   // Volunteer Activity report
    const currentUserId = Number(localStorage.getItem("userId") || 0);

    const fetchEvents = useCallback(async () => {
        try {
            const { data } = await axios.get(`${API_URL}/events`);
            if (!Array.isArray(data?.events)) throw new Error("Bad /events payload");

            const events = data.events.map((e) => ({
                date: new Date(e.start_time),
                title: e.event_name,
                details: e,
            }));
            setAllEvents(events);
        } catch (err) {
            console.error("fetchEvents:", err.message);
            setAllEvents([]);
        }
    }, []);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    return (
        <Layout>
            <Navbar />

            <div className="pt-24 px-4">
                <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

                <div className="mb-6 flex gap-3">
                    <button
                        onClick={() => setReportOpen(true)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-white"
                    >
                        Event Requests Report
                    </button>

                    <button
                        onClick={() => setActivityOpen(true)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded text-white"
                    >
                        Volunteer Activity Report
                    </button>
                </div>

                <CalendarView
                    allEvents={allEvents}
                    currentUserId={currentUserId}
                    refreshEvents={fetchEvents}
                />
            </div>

            <Footer />

            {/* Events/Requests modal */}
            <EventReportModal open={reportOpen} onClose={() => setReportOpen(false)} />

            {/* Volunteer Activity modal */}
            <VolunteerActivityReportModal open={activityOpen} onClose={() => setActivityOpen(false)} />
        </Layout>
    );
}
