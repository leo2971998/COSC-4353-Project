// Leo Nguyen – LoginPage component (full updated; stores fullName; robust JSON parsing)

import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Layout from "../components/Layout";
import { Button } from "../components/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { API_URL } from "../api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { email: "", password: "" } });
  const demoLogin = (role) => {
    const demoUser =
      role === "admin"
        ? { id: 1, role: "admin", fullName: "Demo Admin" }
        : { id: 2, role: "volunteer", fullName: "Demo Volunteer" };
    localStorage.setItem("user", JSON.stringify(demoUser));
    localStorage.setItem("userId", String(demoUser.id));
    localStorage.setItem("fullName", demoUser.fullName);
    localStorage.setItem("profileComplete", "true");
    localStorage.setItem("isLoggedIn", "true");
    navigate(role === "admin" ? "/admin-demo" : "/volunteer-demo");
  };

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      let data = {};
      try {
        data = await res.json();
      } catch {
        /* ignore non-JSON */
      }

      if (!res.ok) {
        toast.error(data.message || "Login failed");
        return;
      }

      toast.success("Login successful");

      // Persist session info (handle various backend field names)
      const userId = data.userId ?? data.user_id ?? data.id;
      const fullName = data.fullName ?? data.full_name ?? data.name ?? null;
      const profileComplete =
          data.profileComplete ?? data.profile_complete ?? false;

      if (userId) {
        localStorage.setItem(
            "user",
            JSON.stringify({ id: userId, role: data.role, fullName })
        );
        localStorage.setItem("userId", String(userId));
        if (fullName) localStorage.setItem("fullName", fullName);
        localStorage.setItem(
            "profileComplete",
            profileComplete ? "true" : "false"
        );
        localStorage.setItem("isLoggedIn", "true");
      }

      // Flash message (optional)
      localStorage.setItem(
          "flashMessages",
          JSON.stringify(["Login successful"])
      );

      // Redirect based on role and profile completion
      if (data.role === "admin") {
        navigate("/admin");
      } else if (data.profileComplete) {
        navigate("/volunteer-dashboard");
      } else {
        navigate("/complete-profile");
      }
    } catch (err) {
      toast.error("Error logging in");
      console.error("Error logging in:", err);
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
              Login
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                    })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="you@example.com"
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
                    {...register("password", { required: "Password required" })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="********"
                />
                {errors.password && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.password.message}
                    </p>
                )}
              </div>

              {/* Submit */}
              <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
              >
                {loading ? "Logging in…" : "Login"}
              </Button>
            </form>

            {/* Link to register page */}
            <div className="text-center mt-4">
              <Link to="/register">
                <Button className="border-blue-500 text-blue-400 hover:bg-blue-500/10">
                  Need an account? Register
                </Button>
              </Link>
            </div>
            <div className="text-center mt-6">
              <p className="text-gray-400 mb-2">Or try a demo</p>
              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => demoLogin("admin")}
                  className="bg-gradient-to-r from-amber-600 to-pink-600 hover:from-amber-700 hover:to-pink-700 text-white py-2 px-4 rounded-xl"
                >
                  Demo Admin
                </Button>
                <Button
                  onClick={() => demoLogin("volunteer")}
                  className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white py-2 px-4 rounded-xl"
                >
                  Demo Volunteer
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </Layout>
  );
}
