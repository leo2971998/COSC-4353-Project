import Navbar from "../components/Navbar";
import { WelcomeBanner } from "../components/VolunteerDashboard/WelcomeBanner";
import { NextEventCard } from "../components/VolunteerDashboard/NextEventCard";
import { SuggestedEvents } from "../components/VolunteerDashboard/SuggestedEvents";
import NotificationsPanel from "../components/VolunteerDashboard/NotificationPanel";
import { CalendarView } from "../components/VolunteerDashboard/DemoCalendar";
import DemoModeIndicator from "../components/DemoModeIndicator";
import FeatureTooltip from "../components/FeatureTooltip";
import { Calendar, Heart, Users, Clock } from "lucide-react";

const nextEvent = {
  event_id: 1,
  event_name: "Park Cleanup",
  start_time: "2025-06-15T09:00:00",
  end_time: "2025-06-15T12:00:00",
  event_location: "Central Park",
  event_category: "Community",
  event_description: "Help clean up the park with fellow volunteers. We'll provide all tools and refreshments!",
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
  {
    event_id: 3,
    event_name: "Senior Center Visit",
    start_time: "2025-06-25T14:00:00",
    end_time: "2025-06-25T17:00:00",
    event_location: "Sunset Senior Living",
    event_category: "Social",
    event_description: "Spend time with seniors playing games, reading, and sharing stories.",
  },
  {
    event_id: 4,
    event_name: "School Tutoring",
    start_time: "2025-07-02T15:30:00",
    end_time: "2025-07-02T17:30:00",
    event_location: "Lincoln Elementary School",
    event_category: "Education",
    event_description: "Help elementary students with math and reading homework.",
  }
];

const notifications = [
  {
    id: 1,
    type: "general",
    message: "Welcome to your volunteer demo dashboard! 🎉",
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    type: "general",
    message: "New volunteer opportunity: Animal Shelter Support this weekend",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    type: "general",
    message: "Thank you for your participation in last month's events! You've contributed 12 hours.",
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 4,
    type: "general",
    message: "Reminder: Park Cleanup event tomorrow at 9:00 AM",
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  }
];

const calendarInfo = [
  {
    event_id: nextEvent.event_id,
    event_name: nextEvent.event_name,
    start_time: nextEvent.start_time,
    end_time: nextEvent.end_time,
    event_location: nextEvent.event_location,
  },
  {
    event_id: 2,
    event_name: "Food Drive",
    start_time: "2025-06-20T10:00:00",
    end_time: "2025-06-20T14:00:00",
    event_location: "Community Center",
  },
  {
    event_id: 3,
    event_name: "Senior Center Visit",
    start_time: "2025-06-25T14:00:00",
    end_time: "2025-06-25T17:00:00",
    event_location: "Sunset Senior Living",
  }
];

// Demo volunteer statistics
const volunteerStats = {
  eventsAttended: 8,
  totalHours: 24,
  impactPoints: 156,
  favoriteCategory: "Community"
};

export default function VolunteerDemoDashboard() {
  return (
    <div className="min-h-screen bg-gray-800 py-12 px-4 text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <DemoModeIndicator role="volunteer" />
        
        <WelcomeBanner name="Demo Volunteer" />
        
        {/* Demo Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6 mb-8">
          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Events Attended</p>
                <p className="text-xl font-bold">{volunteerStats.eventsAttended}</p>
              </div>
              <Calendar className="w-6 h-6 text-green-200" />
            </div>
            <FeatureTooltip 
              title="Event Participation" 
              description="Track your volunteer event attendance history and see your contribution to the community."
            />
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Hours</p>
                <p className="text-xl font-bold">{volunteerStats.totalHours}</p>
              </div>
              <Clock className="w-6 h-6 text-blue-200" />
            </div>
            <FeatureTooltip 
              title="Volunteer Hours" 
              description="Your total volunteer time contribution. Hours are automatically tracked when you participate in events."
            />
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Impact Points</p>
                <p className="text-xl font-bold">{volunteerStats.impactPoints}</p>
              </div>
              <Heart className="w-6 h-6 text-purple-200" />
            </div>
            <FeatureTooltip 
              title="Impact Points" 
              description="Earn points based on your volunteer contributions. Points reflect the positive impact you're making in the community."
            />
          </div>

          <div className="bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm">Favorite Category</p>
                <p className="text-lg font-bold">{volunteerStats.favoriteCategory}</p>
              </div>
              <Users className="w-6 h-6 text-amber-200" />
            </div>
            <FeatureTooltip 
              title="Preferred Activities" 
              description="Based on your participation, we identify your preferred volunteer categories to suggest similar events."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Next Event Card with enhanced tooltip */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xl font-semibold">Your Next Event</h2>
                <FeatureTooltip 
                  title="Upcoming Events" 
                  description="View details of your next scheduled volunteer event including time, location, and what to bring."
                />
              </div>
              <NextEventCard
                eventName={nextEvent.event_name}
                date={nextEvent.start_time}
                time={nextEvent.end_time}
                location={nextEvent.event_location}
                category={nextEvent.event_category}
                eventInfo={nextEvent.event_description}
                event={nextEvent.event_id}
              />
            </div>

            {/* Suggested Events with enhanced tooltip */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xl font-semibold">Suggested Events</h2>
                <FeatureTooltip 
                  title="Event Recommendations" 
                  description="Events recommended based on your skills, interests, and availability. Click to sign up for events that interest you."
                />
              </div>
              <div className="mb-4 p-3 bg-blue-600/20 border border-blue-600/50 rounded-lg">
                <p className="text-blue-200 text-sm">
                  💡 <strong>Demo Feature:</strong> These events are suggested based on your profile. In the full version, you can sign up with one click!
                </p>
              </div>
              <SuggestedEvents suggestedEvents={suggestedEvents} />
            </div>

            {/* Calendar View with enhanced tooltip */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xl font-semibold">Your Calendar</h2>
                <FeatureTooltip 
                  title="Personal Calendar" 
                  description="View all your upcoming volunteer events in calendar format. Sync with your personal calendar app for reminders."
                />
              </div>
              <CalendarView calendarInfo={calendarInfo} />
            </div>
          </div>

          {/* Notifications Panel */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xl font-semibold">Notifications</h2>
              <FeatureTooltip 
                title="Notifications Center" 
                description="Stay updated with event reminders, new opportunities, and community messages. Customize your notification preferences in settings."
              />
            </div>
            <NotificationsPanel notifications={notifications} />
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              🌟 Volunteer Features
              <FeatureTooltip 
                title="Platform Features" 
                description="Explore all the tools available to make your volunteering experience smooth and rewarding."
              />
            </h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Browse and sign up for events</li>
              <li>• Track your volunteer hours automatically</li>
              <li>• Get personalized event recommendations</li>
              <li>• Earn recognition and impact points</li>
              <li>• Connect with other volunteers</li>
              <li>• View your volunteering history and impact</li>
            </ul>
          </div>

          <div className="bg-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              🏆 Your Impact
              <FeatureTooltip 
                title="Community Impact" 
                description="See the real difference your volunteer work makes in the community through detailed impact metrics."
              />
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Parks cleaned:</span>
                <span className="text-green-400 font-semibold">3 locations</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Families helped:</span>
                <span className="text-blue-400 font-semibold">15 families</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Students tutored:</span>
                <span className="text-purple-400 font-semibold">8 students</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Community rating:</span>
                <span className="text-yellow-400 font-semibold">4.9/5 ⭐</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
