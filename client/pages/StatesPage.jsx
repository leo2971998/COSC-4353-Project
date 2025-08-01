import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function StatesPage() {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const [states, setStates] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/states`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setStates(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Failed to fetch states:", err);
      });
  }, [API_URL]);

  return (
    <Layout>
      <Navbar />
      <div className="pt-24 px-4">
        <h1 className="text-2xl font-bold mb-4">States</h1>
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="p-2">Code</th>
              <th className="p-2">Name</th>
            </tr>
          </thead>
          <tbody>
            {states.map((s) => (
              <tr key={s.code} className="border-t border-gray-700">
                <td className="p-2">{s.code}</td>
                <td className="p-2">{s.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </Layout>
  );
}
