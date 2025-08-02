import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { CalendarView } from "../components/VolunteerDashboard/Calendar";
import { NextEventCard } from "../components/VolunteerDashboard/NextEventCard";
import { NotificationsPanel } from "../components/VolunteerDashboard/NotificationPanel";
import { SuggestedEvents } from "../components/VolunteerDashboard/SuggestedEvents";
import { WelcomeBanner } from "../components/VolunteerDashboard/WelcomeBanner";
import axios from "axios";

export default function VolunteerDashboard() {
  const nextEventData = {
    name: "Sthiber",
    nextEvent: {
      eventName: "Community Food Drive",
      date: "Aug 15, 2025",
      time: "9:00 AM - 12:00 PM",
      location: "Downtown Community Center",
      category: "Food Distribution",
      eventInfo:
        "This is a more detailed view of the upcoming event. You can add more fields or interactive options here like RSVP, contact info, or notes.",
      eventID: 1,
    },
  };

  const suggestedEvents = [
    {
      eventID: 1,
      eventName: "Park Cleanup",
      percentMatch: 95,
      date: "Dec 23, 2024",
      time: "4:30 PM",
    },
  ];

  const notifications = [
    {
      id: 1,
      type: "invite",
      eventName: "New Assignment Invitation",
      message: "You've been invited to volunteer at the Community Food Drive.",
      time: "2 hours ago",
      actionRequired: true,
    },
  ];

  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;

  const [nextEvent, setNextEvent] = useState({});

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API_URL}/events`);
      const events = response.data.events.map((e) => ({
        date: new Date(e.start_time),
        title: e.event_name,
        details: e,
      }));
      setAllEvents(events);
      const upcoming = events.filter((e) => e.date >= new Date());
      setUpcomingEvents(upcoming);
    } catch (err) {
      console.error(err);
    }
  };

  const getNextEvent = async () => {
    try {
      const userID = localStorage.getItem("userId");
      const response = await axios.get(
        `${API_URL}/volunteer-dashboard/${userID}`
      );
      setNextEvent(response.data.next_event[0]);
      console.log(nextEvent);
    } catch (error) {}
  };

  useEffect(() => {
    getNextEvent();
    fetchEvents();
  }, []);

  return (
    <>
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
                category={nextEventData.nextEvent.category}
                eventInfo={nextEvent.event_description}
                event={nextEvent.event_id}
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
    </>
  );
}
