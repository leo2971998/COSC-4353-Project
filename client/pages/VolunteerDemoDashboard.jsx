import Navbar from "../components/Navbar";
import { WelcomeBanner } from "../components/VolunteerDashboard/WelcomeBanner";
import { NextEventCard } from "../components/VolunteerDashboard/NextEventCard";
import { SuggestedEvents } from "../components/VolunteerDashboard/SuggestedEvents";
import NotificationsPanel from "../components/VolunteerDashboard/NotificationPanel";
import { CalendarView } from "../components/VolunteerDashboard/Calendar";

const nextEvent = {
  event_id: 1,
  event_name: "Park Cleanup",
  start_time: "2025-06-15T09:00:00",
  end_time: "2025-06-15T12:00:00",
  event_location: "Central Park",
  event_category: "Community",
  event_description: "Help clean up the park with fellow volunteers.",
};

const suggestedEvents = [
  {
    event_id: 2,
    event_name: "Food Drive",
    start_time: "2025-06-20T10:00:00",
    end_time: "2025-06-20T14:00:00",
    event_location: "Community Center",
    event_category: "Charity",
    event_description: "Sort and pack food donations for families in need.",
  },
];

const notifications = [
  {
    id: 1,
    type: "general",
    message: "Welcome to the demo!",
    created_at: new Date().toISOString(),
  },
];

const calendarInfo = [
  {
    event_id: nextEvent.event_id,
    event_name: nextEvent.event_name,
    start_time: nextEvent.start_time,
    end_time: nextEvent.end_time,
    event_location: nextEvent.event_location,
  },
];

export default function VolunteerDemoDashboard() {
  return (
    <div className="min-h-screen bg-gray-800 py-12 px-4 text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <WelcomeBanner name="Demo Volunteer" />
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
            />
            <SuggestedEvents suggestedEvents={suggestedEvents} />
            <CalendarView calendarInfo={calendarInfo} />
          </div>
          <NotificationsPanel notifications={notifications} />
        </div>
      </div>
    </div>
  );
}
