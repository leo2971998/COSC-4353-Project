import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { CalendarView } from "../components/VolunteerDashboard/Calendar";
import { NextEventCard } from "../components/VolunteerDashboard/NextEventCard";
import { NotificationsPanel } from "../components/VolunteerDashboard/NotificationPanel";
import { SuggestedEvents } from "../components/VolunteerDashboard/SuggestedEvents";
import { WelcomeBanner } from "../components/VolunteerDashboard/WelcomeBanner";
import axios from "axios";

export default function VolunteerDashboard() {
  /* ─────────────────────────────
     Local state
     ───────────────────────────── */
  const [nextEvent,       setNextEvent]       = useState({});
  const [suggestedEvents, setSuggestedEvents] = useState([]);
  const [notifications,   setNotifications]   = useState([]);
  const [upcomingEvents,  setUpcomingEvents]  = useState([]);
  const [allEvents,       setAllEvents]       = useState([]);

  const API_URL = "https://cosc-4353-backend.vercel.app";

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
      const { data } = await axios.get(`${API_URL}/volunteer-dashboard/${userID}`);
      const next = Array.isArray(data?.next_event) ? data.next_event[0] : undefined;
      setNextEvent(next ?? {});
    } catch (err) {
      console.error("fetchNextEvent error:", err.message);
      setNextEvent({});
    }
  };

  /* ─────────────────────────────
     Fetch suggested events (backend should return
     [{ event_id, event_name, percent_match, … }])
     ───────────────────────────── */
  const fetchSuggestedEvents = async (userID) => {
    try {
      const { data } = await axios.get(
          `${API_URL}/suggested-events/${userID}`
      );
      setSuggestedEvents(data.suggested_events ?? []);
    } catch (err) {
      console.error("fetchSuggestedEvents error:", err);
    }
  };

  /* ─────────────────────────────
     Fetch volunteer notifications
     ───────────────────────────── */
  const fetchNotifications = async (userID) => {
    try {
      const { data } = await axios.get(
          `${API_URL}/notifications/${userID}`
      );
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

    fetchEvents();
    fetchNextEvent(userID);
    fetchSuggestedEvents(userID);
    fetchNotifications(userID);
  }, []);

  /* ─────────────────────────────
     Render
     ───────────────────────────── */
  return (
      <div className="min-h-screen bg-gray-800 py-12 px-4 sm:px-6 lg:px-8 text-white">
        <Navbar />
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
      </div>
  );
}