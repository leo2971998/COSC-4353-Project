import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { CalendarView } from "../components/VolunteerDashboard/Calendar";
import { NextEventCard } from "../components/VolunteerDashboard/NextEventCard";
import { NotificationsPanel } from "../components/VolunteerDashboard/NotificationPanel";
import { SuggestedEvents } from "../components/VolunteerDashboard/SuggestedEvents";
import { WelcomeBanner } from "../components/VolunteerDashboard/WelcomeBanner";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { User, ChevronRight } from "lucide-react";
import axios from "axios";

export default function VolunteerDashboard() {
  /* ─────────────────────────────
      Local state
      ───────────────────────────── */
  const [loading, setLoading] = useState(true);
  const [nextEvent, setNextEvent] = useState({});
  const [suggestedEvents, setSuggestedEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);

  // const API_URL = "https://cosc-4353-backend.vercel.app";
  const API_URL = import.meta.env.VITE_API_URL;

  /* ─────────────────────────────
      Fetch calendar events
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
      setUpcomingEvents(events.filter((e) => e.date >= new Date()));
    } catch (err) {
      console.error("fetchEvents error:", err.message);
      setAllEvents([]);
      setUpcomingEvents([]);
    }
  };

  /* ─────────────────────────────
      Fetch next confirmed event
      ───────────────────────────── */
  const fetchNextEvent = async (userID) => {
    try {
      const { data } = await axios.get(
        `${API_URL}/volunteer-dashboard/${userID}`
      );
      setNextEvent(data.nextEvent?.[0] ?? null);
    } catch (error) {
      console.error("fetchNextEvent error: ", error);
    }
  };

  /* ─────────────────────────────
      Fetch suggested events (backend should return
      [{ event_id, event_name, percent_match, … }])
      ───────────────────────────── */
  const fetchSuggestedEvents = async (userID) => {
    try {
      const { data } = await axios.get(`${API_URL}/api/match/${userID}`);
      setSuggestedEvents(data ?? []);
    } catch (err) {
      console.error("fetchSuggestedEvents error:", err);
    }
  };

  /* ─────────────────────────────
      Fetch volunteer notifications
      ───────────────────────────── */
  const fetchNotifications = async (userID) => {
    try {
      const { data } = await axios.get(`${API_URL}/notifications/${userID}`);
      setNotifications(data.notifications ?? []);
    } catch (err) {
      console.error("fetchNotifications error:", err);
    }
  };

  /* ─────────────────────────────
      Composite load on mount
      ───────────────────────────── */
  useEffect(() => {
    const userID = localStorage.getItem("userId");
    if (!userID) return;
    const loadData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchEvents(),
          fetchNextEvent(userID),
          fetchSuggestedEvents(userID),
          fetchNotifications(userID),
        ]);
      } catch (error) {
        console.error("Error loading dashboard", error);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };
    loadData();
  }, []);

  /* ─────────────────────────────
      Render
      ───────────────────────────── */
  return (
    <div className="min-h-screen bg-gray-800 py-12 px-4 sm:px-6 lg:px-8 text-white">
      <Navbar />

      {loading ? (
        <LoadingSpinner fullScreen text="Loading your dashboard" />
      ) : nextEvent?.is_complete == 1 ? (
        <div className="container mx-auto px-4 py-6">
          <WelcomeBanner name={nextEvent.full_name} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            <div className="lg:col-span-2">
              <NextEventCard
                eventName={nextEvent.event_name}
                date={nextEvent.start_time}
                time={nextEvent.end_time}
                location={nextEvent.event_location}
                category={nextEvent.event_category}
                eventInfo={nextEvent.event_description}
                event={nextEvent.event_id}
                requiredSkills={nextEvent.required_skills}
              />
              <SuggestedEvents suggestedEvents={suggestedEvents} />
              <CalendarView
                upcomingEvents={upcomingEvents}
                allEvents={allEvents}
              />
            </div>
            <NotificationsPanel notifications={notifications} />
          </div>
        </div>
      ) : (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
          <div className="bg-[#1a2035] text-white rounded-xl p-8 max-w-md w-full mx-4 shadow-lg border border-gray-700/50">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-indigo-600/20 rounded-full flex items-center justify-center mb-6">
                <User className="text-indigo-400" size={32} />
              </div>

              <h2 className="text-2xl font-semibold text-white mb-3">
                Complete Your Profile
              </h2>

              <p className="text-gray-300 mb-8 leading-relaxed">
                Please finish setting up your profile to access all dashboard
                features and get the most out of your experience.
              </p>

              <button
                onClick={() => (window.location.href = "/complete-profile")}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center group"
              >
                Complete Profile Now
                <ChevronRight
                  size={18}
                  className="ml-2 group-hover:translate-x-1 transition-transform duration-200"
                />
              </button>

              <p className="text-xs text-gray-400 mt-4">
                This will only take a few minutes
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
