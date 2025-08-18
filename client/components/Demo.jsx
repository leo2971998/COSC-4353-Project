import { Button } from "./ui/Button";
import { Monitor, Users, Calendar, BarChart3, Bell, CheckCircle, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DemoCard = ({ title, description, features, buttonText, demoPath, icon: Icon, bgGradient }) => {
  const navigate = useNavigate();

  return (
    <div className={`${bgGradient} rounded-2xl p-8 border border-gray-600 hover:border-blue-500/50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl`}>
      <div className="flex items-center mb-6">
        <div className="p-3 bg-white/10 rounded-lg mr-4">
          <Icon className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-white">{title}</h3>
      </div>
      
      <p className="text-gray-200 mb-6 text-lg leading-relaxed">
        {description}
      </p>
      
      <div className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center text-gray-200">
            <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
            <span>{feature}</span>
          </div>
        ))}
      </div>
      
      <Button
        onClick={() => navigate(demoPath)}
        className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 hover:border-white/50 py-3 px-6 text-lg font-semibold rounded-lg transition-all duration-300 flex items-center justify-center"
      >
        <Play className="w-5 h-5 mr-2" />
        {buttonText}
      </Button>
    </div>
  );
};

export default function Demo() {
  return (
    <section id="demo" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Experience the Platform
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Try our interactive demos to see how our platform streamlines volunteer management 
            and creates meaningful connections between volunteers and organizations.
          </p>
        </div>

        {/* Demo Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <DemoCard
            title="Volunteer Dashboard"
            description="Discover how volunteers can easily find events, track their impact, and stay connected with their community through our intuitive dashboard."
            features={[
              "View upcoming events and opportunities",
              "Track volunteer history and achievements", 
              "Receive personalized event recommendations",
              "Stay updated with real-time notifications"
            ]}
            buttonText="Try Volunteer Demo"
            demoPath="/volunteer-demo"
            icon={Users}
            bgGradient="bg-gradient-to-br from-blue-600/80 to-purple-600/80"
          />
          
          <DemoCard
            title="Admin Dashboard"
            description="Experience how administrators can efficiently manage events, coordinate volunteers, and gain insights into their organization's impact."
            features={[
              "Create and manage volunteer events",
              "View comprehensive event calendar",
              "Generate detailed activity reports",
              "Monitor volunteer engagement metrics"
            ]}
            buttonText="Try Admin Demo"
            demoPath="/admin-demo"
            icon={Monitor}
            bgGradient="bg-gradient-to-br from-green-600/80 to-blue-600/80"
          />
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-600 rounded-3xl p-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Join our community today and start making a difference. Whether you're looking to volunteer 
              or manage volunteer programs, we have the tools you need.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Sign Up as Volunteer
              </Button>
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Register Organization
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}