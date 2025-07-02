// Leo Nguyen - Created LoginPage component
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Layout from "../components/Layout";
import { Button } from "../components/ui/Button";
// Leo Nguyen - link component for register button
import { Link } from "react-router-dom";

export default function LoginPage() {
  // Leo Nguyen - login form state
  const [formData, setFormData] = useState({ email: "", password: "" });

  // Leo Nguyen - handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Leo Nguyen - placeholder submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login submitted", formData);
  };

  return (
    <Layout>
      <Navbar />
      <div className="min-h-screen pt-24 bg-gray-800 px-4">
        <div className="max-w-md mx-auto bg-gray-900 border border-gray-700 rounded-3xl p-8 shadow-2xl">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">Login</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
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
            <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
              Login
            </Button>
          </form>
          {/* Leo Nguyen - link to register page */}
          <div className="text-center mt-4">
            <Link to="/register">
              <Button className="border-blue-500 text-blue-400 hover:bg-blue-500/10">
                Need an account? Register
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </Layout>
  );
}
