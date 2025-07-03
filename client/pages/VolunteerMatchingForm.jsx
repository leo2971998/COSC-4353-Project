import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function VolunteerMatchingForm() {
  const [volunteers] = useState([
    {
      id: 1,
      name: "Ava Johnson",
      skills: ["first aid", "event setup"],
    },
    {
      id: 2,
      name: "Liam Chen",
      skills: ["registration", "hospitality"],
    },
  ]);

  const [events] = useState([
    {
      id: 101,
      name: "Community Health Fair",
      date: "2025-07-05",
      location: "Downtown Center",
      description: "Provide first aid and registration support",
      needs: ["first aid", "registration"],
    },
    {
      id: 102,
      name: "Charity Run",
      date: "2025-07-12",
      location: "City Park",
      description: "Help with setup and water stations",
      needs: ["event setup", "water station"],
    },
  ]);

  const [selectedVolunteerId, setSelectedVolunteerId] = useState("");
  const [matchedEvent, setMatchedEvent] = useState(null);

  useEffect(() => {
    if (!selectedVolunteerId) {
      setMatchedEvent(null);
      return;
    }

    const volunteer = volunteers.find((v) => v.id === parseInt(selectedVolunteerId));

    const match = events.find((event) =>
      event.needs.some((skill) => volunteer.skills.includes(skill))
    );

    setMatchedEvent(match || null);
  }, [selectedVolunteerId]);

  return (
    <Layout>
      <Navbar />
      <div className="min-h-screen bg-gray-800 text-white p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Volunteer Matching</h1>

        {/* Select Volunteer */}
        <div className="max-w-md mx-auto mb-6">
          <label htmlFor="volunteer" className="block mb-2 text-sm font-medium">
            Select Volunteer:
          </label>
          <select
            id="volunteer"
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600"
            value={selectedVolunteerId}
            onChange={(e) => setSelectedVolunteerId(e.target.value)}
          >
            <option value="">-- Select a Volunteer --</option>
            {volunteers.map((vol) => (
              <option key={vol.id} value={vol.id}>
                {vol.name}
              </option>
            ))}
          </select>
        </div>

        {/* Matched Event */}
        {matchedEvent ? (
          <div className="max-w-md mx-auto mt-6 p-4 border border-blue-600 rounded bg-gray-900 shadow-xl">
            <h2 className="text-xl font-semibold mb-2">Matched Event</h2>
            <p><strong>Name:</strong> {matchedEvent.name}</p>
            <p><strong>Date:</strong> {matchedEvent.date}</p>
            <p><strong>Location:</strong> {matchedEvent.location}</p>
            <p><strong>Description:</strong> {matchedEvent.description}</p>
          </div>
        ) : (
          selectedVolunteerId && (
            <p className="text-center text-red-400">No matching event found for this volunteer.</p>
          )
        )}
      </div>
      <Footer />
    </Layout>
  );
}