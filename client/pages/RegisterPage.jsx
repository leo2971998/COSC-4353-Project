// Leo Nguyen – RegisterPage component (uses fullName; backward-compatible payload)
// Run inside your React Router app

import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useState } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Layout from "../components/Layout";
import { Button } from "../components/ui/Button";
import { API_URL } from "../api";

export default function RegisterPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { fullName: "", email: "", password: "", confirm: "" },
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const payload = {
        fullName: formData.fullName, // new key used by updated backend
        name: formData.fullName,     // legacy fallback (safe to remove later)
        email: formData.email,
        password: formData.password,
      };

      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Try to parse JSON, tolerate non‑JSON error bodies
      let data = {};
      try {
        data = await res.json();
      } catch {
        /* ignore parse errors */
      }

      if (!res.ok) {
        toast.error(data.message || `Registration failed (${res.status})`);
      } else {
        toast.success("Registered successfully");
        localStorage.setItem(
            "flashMessages",
            JSON.stringify(["Registration successful. Please log in."])
        );
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
              {/* Full Name */}
              <div>
                <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Full Name
                </label>
                <input
                    id="fullName"
                    type="text"
                    {...register("fullName", {
                      required: "Name required",
                      maxLength: 255,
                    })}
                    placeholder="Your name"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.fullName && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.fullName.message}
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
                      minLength: {
                        value: 6,
                        message: "At least 6 characters",
                      },
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
