// Leo Nguyen – RegisterPage component (fixed API path + nicer errors)

import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useState } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Layout from "../components/Layout";
import { Button } from "../components/ui/Button";

export default function RegisterPage() {
  const navigate = useNavigate();
  // Point to the API root.  In production the Express app is mounted under /api.
  const API_ROOT = "https://cosc-4353-backend.vercel.app";

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { name: "", email: "", password: "", confirm: "" },
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_ROOT}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      // If the response isn’t JSON (e.g. CORS blocked), fall back gracefully
      let data = {};
      try {
        data = await res.json();
      } catch {
        /* ignore */
      }

      if (!res.ok) {
        // Show whatever message came back or a generic one
        toast.error(data.message || `Registration failed (${res.status})`);
      } else {
        toast.success("Registered successfully");
        navigate("/login");
      }
    } catch (err) {
      toast.error("Network error: could not reach server");
      console.error("RegisterPage:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
      <Layout>
        <Navbar />
        <div className="min-h-screen pt-24 bg-gray-800 px-4">
          <div className="max-w-md mx-auto bg-gray-900 border border-gray-700 rounded-3xl p-8 shadow-2xl">
            <h1 className="text-2xl font-bold text-white mb-6 text-center">
              Create Account
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name */}
              <div>
                <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Full Name
                </label>
                <input
                    id="name"
                    type="text"
                    {...register("name", {
                      required: "Name required",
                      maxLength: 255,
                    })}
                    placeholder="Your name"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.name && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.name.message}
                    </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Email
                </label>
                <input
                    id="email"
                    type="email"
                    {...register("email", {
                      required: "Email required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email",
                      },
                      maxLength: 255,
                    })}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.email && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.email.message}
                    </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Password
                </label>
                <input
                    id="password"
                    type="password"
                    {...register("password", {
                      required: "Password required",
                      minLength: 6,
                      maxLength: 255,
                    })}
                    placeholder="********"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.password && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.password.message}
                    </p>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <label
                    htmlFor="confirm"
                    className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Confirm Password
                </label>
                <input
                    id="confirm"
                    type="password"
                    {...register("confirm", {
                      required: "Confirm your password",
                      validate: (value) =>
                          value === watch("password") || "Passwords do not match",
                    })}
                    placeholder="********"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.confirm && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.confirm.message}
                    </p>
                )}
              </div>

              {/* Submit */}
              <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
              >
                {loading ? "Registering…" : "Register"}
              </Button>
            </form>

            {/* Link to login */}
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
