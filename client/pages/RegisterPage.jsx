// Leo Nguyen - Created RegisterPage component
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Layout from "../components/Layout";
import { Button } from "../components/ui/Button";
// Leo Nguyen - link component for login button
import { Link } from "react-router-dom";

export default function RegisterPage() {
  // Leo Nguyen - register form state
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirm: "" });
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // Leo Nguyen - handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Leo Nguyen - submit handler to call backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm) {
      alert("Passwords do not match");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        console.error(data.message);
      } else {
        console.log(data.message);
      }
    } catch (err) {
      console.error("Error registering:", err);
    }
  };

  return (
    <Layout>
      <Navbar />
      <div className="min-h-screen pt-24 bg-gray-800 px-4">
        <div className="max-w-md mx-auto bg-gray-900 border border-gray-700 rounded-3xl p-8 shadow-2xl">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">Create Account</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="********"
              />
            </div>
            <div>
              <label htmlFor="confirm" className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <input
                id="confirm"
                name="confirm"
                type="password"
                value={formData.confirm}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="********"
              />
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
              Register
            </Button>
          </form>
          {/* Leo Nguyen - link to login page */}
          <div className="text-center mt-4">
            <Link to="/login">
              <Button className="border-blue-500 text-blue-400 hover:bg-blue-500/10">
                Already have an account? Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </Layout>
  );
}
