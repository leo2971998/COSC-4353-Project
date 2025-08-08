import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { CalendarView } from "../components/VolunteerDashboard/Calendar";
import { NextEventCard } from "../components/VolunteerDashboard/NextEventCard";
import NotificationsPanel from "../components/VolunteerDashboard/NotificationPanel";
import { SuggestedEvents } from "../components/VolunteerDashboard/SuggestedEvents";
import { WelcomeBanner } from "../components/VolunteerDashboard/WelcomeBanner";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { User, ChevronRight } from "lucide-react";
import axios from "axios";
import { DashboardNavigation } from "../components/VolunteerDashboard/DashboardNavigation";
import { MyEvents } from "../components/VolunteerDashboard/MyEvents";
import { VolunteerHistory } from "../components/VolunteerDashboard/History";
import { BrowseEvents } from "../components/VolunteerDashboard/BrowseEvents";
/* ──────────────────────────────────────────────────────────────
   BASE URLs
────────────────────────────────────────────────────────────── */
const HARD_API = "https://cosc-4353-backend.vercel.app"; // always works for Leo
const API_URL = import.meta.env.VITE_API_URL || HARD_API; // others use env

export default function VolunteerDashboard() {
  /* ───────── local state ───────── */
  const [loading, setLoading] = useState(true);
  const [nextEvent, setNextEvent] = useState({});
  const [suggestedEvents, setSuggested] = useState([]);
  const [notifications, setNotifications] = useState([]);
  // const [upcomingEvents, setUpcoming] = useState([]);
  // const [allEvents, setAllEvents] = useState([]);
  const [calendarInfo, setCalendarInfo] = useState([]);
  const [activeSection, setActiveSection] = useState("overview");
  const [enrolledEvents, setEnrolledEvents] = useState([]);
  const [browseEvents, setBrowseEvents] = useState([]);

  /* ───────── helpers ───────── */
  // const fetchEvents = async () => {
  //   // Leo Nguyen - /events must hit HARD_API
  //   const { data } = await axios.get(`${HARD_API}/events`);
  //   const events = (data?.events || []).map((e) => ({
  //     date: new Date(e.start_time),
  //     title: e.event_name,
  //     details: e,
  //   }));
  //   setAllEvents(events);
  //   setUpcoming(events.filter((e) => e.date >= new Date()));
  // };

  const fetchCalendarEvents = async (userID) => {
    try {
      const { data } = await axios.get(
        `${API_URL}/volunteer-dashboard/calendar/${userID}`
      );
      setCalendarInfo(data?.calendarData || []);
    } catch (error) {
      console.error(
        "Error fetching the calendar data in the frontend: ",
        error
      );
    }
  };

  const fetchNextEvent = async (uid) => {
    const { data } = await axios.get(`${API_URL}/volunteer-dashboard/${uid}`);
    setNextEvent(data.nextEvent?.[0] ?? null);
  };

  const fetchSuggestedEvents = async (uid) => {
    const { data } = await axios.get(`${API_URL}/api/match/${uid}`);
    setSuggested(data ?? []);
  };

  // Leo Nguyen - combine general + volunteer-request notifications
  const fetchCombinedNotifications = async (uid) => {
    const [{ data: gen }, { data: vr }] = await Promise.all([
      axios.get(`${HARD_API}/notifications/${uid}`),
      axios.get(`${HARD_API}/vr-notifications/${uid}`),
    ]);

    const generic = (gen.notifications || []).map((n) => ({
      ...n,
      type: "general",
    }));
    const requests = (vr || []).map((n) => ({ ...n, type: "request" }));

    setNotifications(
      [...generic, ...requests].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      )
    );
  };

  const fetchEnrolledEvents = async (userID) => {
    try {
      const { data } = await axios.get(
        `${API_URL}/volunteer-dashboard/enrolled-events/${userID}`
      );
      setEnrolledEvents(data?.events || []);
    } catch (error) {}
  };

  const fetchBrowseEvents = async (userID) => {
    try {
      const { data } = await axios.get(
        `${API_URL}/volunteer-dashboard/browse-events/${userID}`
      );
      setBrowseEvents(data?.events || []);
    } catch (error) {
      console.error("Error fetching all events for browse events tab: ", error);
    }
  };

  const onBrowseEnroll = async (userID, eventID) => {
    try {
      await axios.post(
        `${API_URL}/volunteer-dashboard/browse-enroll/${userID}/${eventID}`
      );

      await Promise.all([
        fetchEnrolledEvents(userID),
        fetchBrowseEvents(userID),
        fetchSuggestedEvents(userID),
        fetchCalendarEvents(userID),
      ]);
    } catch (error) {
      console.error("Error in onBrowseEnroll ", error);
    }
  };

  /* ───────── load on mount ───────── */
  const userID = localStorage.getItem("userId");

  const loadData = async () => {
    if (!userID) return;
    try {
      setLoading(true);
      await Promise.all([
        // fetchEvents(),
        fetchCalendarEvents(userID),
        fetchNextEvent(userID),
        fetchSuggestedEvents(userID),
        fetchCombinedNotifications(userID),
        fetchEnrolledEvents(userID),
        fetchBrowseEvents(userID),
      ]);
    } catch (err) {
      console.error("Dashboard load error:", err);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  useEffect(() => {
    if (userID) loadData();
  }, []);

  /* ───────── render ───────── */
  return (
    <div className="min-h-screen bg-gray-800 py-12 px-4 sm:px-6 lg:px-8 text-white">
      <Navbar />

      {loading ? (
        <LoadingSpinner fullScreen text="Loading your dashboard" />
      ) : nextEvent?.is_complete === 1 ? (
        <div className="container mx-auto px-4 py-6">
          <WelcomeBanner name={nextEvent.full_name} />

          <div className="mt-6">
            <DashboardNavigation
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />
          </div>

          {/* main column */}
          {activeSection == "overview" && (
            <>
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

                  <SuggestedEvents
                    suggestedEvents={suggestedEvents}
                    onRefresh={loadData}
                  />

                  <CalendarView calendarInfo={calendarInfo} />
                </div>
                <NotificationsPanel
                  notifications={notifications}
                  refresh={() => fetchCombinedNotifications(userID)}
                />
              </div>
            </>
          )}

          {activeSection === "my-events" && (
            <div className="grid grid-cols-1 lg:grid-cols-1">
              <MyEvents enrolledEvents={enrolledEvents} onRefresh={loadData} />
            </div>
          )}

          {activeSection === "all-events" && (
            <BrowseEvents allEvents={browseEvents} onEnroll={onBrowseEnroll} />
          )}

          {activeSection === "history" && <VolunteerHistory />}
        </div>
      ) : (
        /* profile-incomplete overlay */
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
          <div className="bg-[#1a2035] text-white rounded-xl p-8 max-w-md w-full mx-4 shadow-lg border border-gray-700/50">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-indigo-600/20 rounded-full flex items-center justify-center mb-6">
                <User className="text-indigo-400" size={32} />
              </div>

              <h2 className="text-2xl font-semibold mb-3">
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
