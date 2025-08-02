import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CalendarView } from "../components/VolunteerDashboard/Calendar";

export default function AdminPage() {
    /* ─────────────────────────────
       Local state
       ───────────────────────────── */
    const [allEvents,      setAllEvents]      = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);

    const API_URL =
        import.meta.env.VITE_API_URL || "https://cosc-4353-backend.vercel.app";

    /* ─────────────────────────────
       Fetch all events once
       ───────────────────────────── */
    const fetchEvents = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/events`);
            if (!Array.isArray(data?.events)) throw new Error("Bad /events payload");

            const events = data.events.map((e) => ({
                date: new Date(e.start_time),
                title: e.event_name,
                details: e,
            }));

            setAllEvents(events);

            const upcoming = events
                .filter((e) => e.date >= new Date())
                .sort((a, b) => a.date - b.date); // chronological
            setUpcomingEvents(upcoming);
        } catch (err) {
            console.error("Admin fetchEvents error:", err.message);
            setAllEvents([]);
            setUpcomingEvents([]);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    /* ─────────────────────────────
       Render
       ───────────────────────────── */
    return (
        <Layout>
            <Navbar />
            <div className="pt-24 px-4">
                <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

                {/* Same CalendarView component used elsewhere */}
                <CalendarView
                    upcomingEvents={upcomingEvents}
                    allEvents={allEvents}
                />
            </div>
            <Footer />
        </Layout>
    );
}
