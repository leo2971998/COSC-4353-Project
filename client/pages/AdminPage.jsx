import Layout from "../components/Layout";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CalendarView } from "../components/VolunteerDashboard/Calendar";

export default function AdminPage() {
  const upcomingEvents = [
    {
      date: new Date(2025, 7, 15),
      title: "Community Food Drive",
    },
  ];

  const allEvents = [
    { date: new Date(2025, 7, 15), title: "Community Food Drive" },
    { date: new Date(2024, 11, 22), title: "Senior Care Visit" },
  ];

  return (
    <Layout>
      <Navbar />
      <div className="pt-24 px-4">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <CalendarView upcomingEvents={upcomingEvents} allEvents={allEvents} />
      </div>
      <Footer />
    </Layout>
  );
}
