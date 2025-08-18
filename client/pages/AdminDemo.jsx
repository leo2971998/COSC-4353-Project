import Layout from "../components/Layout";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CalendarView from "../components/AdminDashboard/AdminCalendar.jsx";
import DemoModeIndicator from "../components/DemoModeIndicator";
import FeatureTooltip from "../components/FeatureTooltip";
import { Users, Calendar, TrendingUp, ClipboardList } from "lucide-react";

// Enhanced demo events with realistic data
const demoEvents = [
  { 
    date: new Date("2025-06-15T09:00:00"), 
    title: "Park Cleanup", 
    details: {
      event_location: "Central Park",
      event_description: "Community park cleanup with 25 volunteers",
      required_skills: "Physical work, teamwork",
      urgency: "Medium"
    }
  },
  { 
    date: new Date("2025-06-20T10:00:00"), 
    title: "Food Drive", 
    details: {
      event_location: "Community Center",
      event_description: "Sorting and distributing food donations",
      required_skills: "Organization, customer service",
      urgency: "High"
    }
  },
  { 
    date: new Date("2025-06-25T14:00:00"), 
    title: "Senior Center Visit", 
    details: {
      event_location: "Sunset Senior Living",
      event_description: "Social activities and companionship for seniors",
      required_skills: "Communication, patience, empathy",
      urgency: "Low"
    }
  },
  { 
    date: new Date("2025-07-02T08:00:00"), 
    title: "School Tutoring", 
    details: {
      event_location: "Lincoln Elementary School",
      event_description: "Math and reading tutoring for grades 3-5",
      required_skills: "Teaching, mathematics, reading",
      urgency: "High"
    }
  },
  { 
    date: new Date("2025-07-10T16:00:00"), 
    title: "Animal Shelter Support", 
    details: {
      event_location: "Happy Paws Animal Shelter",
      event_description: "Dog walking, cleaning, and general care",
      required_skills: "Animal care, physical work",
      urgency: "Medium"
    }
  }
];

// Demo statistics for admin dashboard
const demoStats = {
  totalVolunteers: 127,
  activeEvents: 8,
  completedEvents: 23,
  totalHours: 1456
};

export default function AdminDemo() {
  return (
    <Layout>
      <Navbar />
      <div className="pt-24 px-4 max-w-7xl mx-auto">
        <DemoModeIndicator role="admin" />
        
        <div className="flex items-center gap-2 mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <FeatureTooltip 
            title="Admin Dashboard" 
            description="Your central hub for managing events, volunteers, and viewing analytics. Monitor all volunteer activities and organizational performance from here."
          />
        </div>

        {/* Demo Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Volunteers</p>
                <p className="text-2xl font-bold">{demoStats.totalVolunteers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-200" />
            </div>
            <FeatureTooltip 
              title="Volunteer Management" 
              description="Track registered volunteers, their skills, and participation history. Manage volunteer profiles and assignments."
            />
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Active Events</p>
                <p className="text-2xl font-bold">{demoStats.activeEvents}</p>
              </div>
              <Calendar className="w-8 h-8 text-green-200" />
            </div>
            <FeatureTooltip 
              title="Event Management" 
              description="Create, edit, and manage volunteer events. Set requirements, schedules, and track participation."
            />
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Completed Events</p>
                <p className="text-2xl font-bold">{demoStats.completedEvents}</p>
              </div>
              <ClipboardList className="w-8 h-8 text-purple-200" />
            </div>
            <FeatureTooltip 
              title="Event History" 
              description="View completed events, volunteer participation, and event outcomes. Generate reports on past activities."
            />
          </div>

          <div className="bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm">Total Hours</p>
                <p className="text-2xl font-bold">{demoStats.totalHours.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-amber-200" />
            </div>
            <FeatureTooltip 
              title="Volunteer Hours Tracking" 
              description="Monitor total volunteer hours contributed across all events. Generate reports for impact measurement."
            />
          </div>
        </div>

        {/* Enhanced Calendar Section */}
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-semibold">Event Calendar</h2>
            <FeatureTooltip 
              title="Event Calendar" 
              description="View all upcoming and ongoing events in calendar format. Click on events to view details, edit, or manage volunteer assignments."
            />
          </div>
          <div className="mb-4 p-4 bg-blue-600/20 border border-blue-600/50 rounded-lg">
            <p className="text-blue-200 text-sm">
              💡 <strong>Demo Features:</strong> Click on any event to see details. In the full version, you can create new events, assign volunteers, and send notifications.
            </p>
          </div>
          <CalendarView allEvents={demoEvents} currentUserId={1} refreshEvents={() => {}} />
        </div>

        {/* Feature Highlights */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              🎯 Key Admin Features
              <FeatureTooltip 
                title="Admin Capabilities" 
                description="As an admin, you have full access to manage the volunteer platform, create events, and oversee all activities."
              />
            </h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Create and manage volunteer events</li>
              <li>• Assign volunteers to specific events</li>
              <li>• Generate detailed reports and analytics</li>
              <li>• Manage volunteer profiles and skills</li>
              <li>• Send notifications and updates</li>
              <li>• Track volunteer hours and impact</li>
            </ul>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              📊 Coming Next
              <FeatureTooltip 
                title="Platform Roadmap" 
                description="Future enhancements planned for the volunteer management platform to improve user experience and functionality."
              />
            </h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Advanced volunteer matching algorithms</li>
              <li>• Mobile app for volunteers</li>
              <li>• Integration with community partners</li>
              <li>• Automated reminder systems</li>
              <li>• Impact measurement dashboards</li>
              <li>• Volunteer recognition programs</li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </Layout>
  );
}
