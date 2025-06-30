import FeatureCard from "./FeatureCard";
import { Users, Calendar, Clock, Bell } from "lucide-react";
import { Button } from "./ui/Button";

export default function About() {
  return (
    <section id="about" className="py-20 bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Volunteering Made Simple
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our platform connects passionate volunteers with meaningful
            opportunities, making it easier than ever to give back to your
            community.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={Users}
            title="Smart Volunteer Matching"
            text="Get matched with opportunities that align with your skills, interests, and availability for maximum impact."
            bgColor="bg-gradient-to-br from-blue-500 to-blue-600"
            borderColor="border-blue-500/50"
          />
          <FeatureCard
            icon={Calendar}
            title="Event Coordination"
            text="Seamlessly organize and participate in volunteer events with integrated planning and communication tools."
            bgColor="bg-gradient-to-br from-purple-500 to-purple-600"
            borderColor="border-purple-500/50"
          />
          <FeatureCard
            icon={Clock}
            title="Personalized Schedules"
            text="Manage your volunteer commitments with flexible scheduling that works around your busy life."
            bgColor="bg-gradient-to-br from-green-500 to-green-600"
            borderColor="border-green-500/50"
          />
          <FeatureCard
            icon={Bell}
            title="Real-time Notifications"
            text="Stay informed about new opportunities, event updates, and community impact through smart notifications."
            bgColor="bg-gradient-to-br from-orange-500 to-orange-600"
            borderColor="border-orange-500/50"
          />
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-600 rounded-3xl p-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Ready to Make a Difference?
            </h3>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of volunteers who are already making an impact in
              their communities. Your skills and passion can change lives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Get Started Today
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
