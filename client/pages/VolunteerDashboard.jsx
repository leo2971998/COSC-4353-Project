import Navbar from "../components/Navbar";
import { CalendarView } from "../components/VolunteerDashboard/Calendar";
import { NextEventCard } from "../components/VolunteerDashboard/NextEventCard";
import { NotificationsPanel } from "../components/VolunteerDashboard/NotificationPanel";
import { SuggestedEvents } from "../components/VolunteerDashboard/SuggestedEvents";
import { WelcomeBanner } from "../components/VolunteerDashboard/WelcomeBanner";

export default function VolunteerDashboard() {
  const backendData = {
    name: "Sthiber",
    nextEvent: {
      eventName: "Community Food Drive",
      date: "Dec 12, 2024",
      time: "9:00 AM - 12:00 PM",
      location: "Downtown Community Center",
      category: "Food Distribution",
      eventID: "1",
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

  const upcomingEvents = [
    {
      date: new Date(2025, 7, 15),
      title: "Community Food Drive",
    },
  ];

  const allEvents = [
    {
      date: new Date(2025, 7, 15),
      title: "Community Food Drive",
    },
    {
      date: new Date(2024, 11, 22),
      title: "Senior Care Visit",
    },
  ];
  return (
    <>
      <div className="min-h-screen bg-gray-800 py-12 px-4 sm:px-6 lg:px-8 text-white">
        <Navbar />
        <div className="container mx-auto px-4 py-6">
          <WelcomeBanner name={backendData.name} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            <div className="lg:col-span-2">
              <NextEventCard
                eventName={backendData.nextEvent.eventName}
                date={backendData.nextEvent.date}
                time={backendData.nextEvent.time}
                location={backendData.nextEvent.location}
                category={backendData.nextEvent.category}
                event={backendData.nextEvent.eventID}
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
