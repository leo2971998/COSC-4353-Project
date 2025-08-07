import { useEffect, useState } from "react";
import axios from "axios";

import Layout     from "../components/Layout";
import Navbar     from "../components/Navbar";
import Footer     from "../components/Footer";
import {CalendarView} from "../components/AdminDashboard/AdminCalendar.jsx";

export default function AdminPage() {
    const [allEvents, setAllEvents]         = useState([]);
    const [upcomingEvents, setUpcoming]     = useState([]);

    const currentUserId = Number(localStorage.getItem("userId") || 0);
    const API_URL = "https://cosc-4353-backend.vercel.app";

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
            setUpcoming(events.filter((e) => e.date >= new Date()).sort((a, b) => a.date - b.date));
        } catch (err) {
            console.error("Admin fetchEvents error:", err.message);
            setAllEvents([]);
            setUpcoming([]);
        }
    };

    useEffect(() => { fetchEvents(); }, []);

    return (
        <Layout>
            <Navbar />
            <div className="pt-24 px-4">
                <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

                <CalendarView
                    isAdmin={true}
                    currentUserId={currentUserId}
                    allEvents={allEvents}
                    upcomingEvents={upcomingEvents}
                />
            </div>
            <Footer />
        </Layout>
    );
}