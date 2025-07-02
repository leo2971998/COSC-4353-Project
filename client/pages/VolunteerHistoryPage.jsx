import Navbar from "../components/Navbar";
import VHeader from "../components/VolunteerHistory/VHeader";

export default function VolunteerHistoryPage() {
  return (
    <>
      <div className="min-h-screen bg-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <Navbar />
        <VHeader />
      </div>
    </>
  );
}
