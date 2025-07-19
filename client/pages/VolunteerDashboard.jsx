import Navbar from "../components/Navbar";
import { NextEventCard } from "../components/VolunteerDashboard/NextEventCard";
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
