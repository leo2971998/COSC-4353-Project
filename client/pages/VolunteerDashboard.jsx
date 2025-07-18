import Navbar from "../components/Navbar";
import { WelcomeBanner } from "../components/VolunteerDashboard/WelcomeBanner";

export default function VolunteerDashboard() {
  const backendData = {
    name: "Sthiber",
  };
  return (
    <>
      <div className="min-h-screen bg-gray-800 py-12 px-4 sm:px-6 lg:px-8 text-white">
        <Navbar />
        <div className="container mx-auto px-4 py-6">
          <WelcomeBanner name={backendData.name} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            <div className="lg:col-span-2"></div>
          </div>
        </div>
      </div>
    </>
  );
}
