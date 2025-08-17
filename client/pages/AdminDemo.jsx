import Layout from "../components/Layout";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CalendarView from "../components/AdminDashboard/AdminCalendar.jsx";

const demoEvents = [
  { date: new Date("2025-06-15T09:00:00"), title: "Park Cleanup", details: {} },
  { date: new Date("2025-06-20T10:00:00"), title: "Food Drive", details: {} },
];

export default function AdminDemo() {
  return (
    <Layout>
      <Navbar />
      <div className="pt-24 px-4">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard (Demo)</h1>
        <CalendarView allEvents={demoEvents} currentUserId={1} refreshEvents={() => {}} />
      </div>
      <Footer />
    </Layout>
  );
}
