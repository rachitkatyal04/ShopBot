"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { login } from "../lib/api";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");

  // Check for "registered" query parameter
  useEffect(() => {
    const registered = searchParams.get("registered");
    if (registered === "true") {
      setWelcomeMessage(
        "Your account was created successfully! Please log in with your new credentials."
      );
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setWelcomeMessage("");
    setIsLoading(true);

    try {
      // Validate form
      if (!formData.email || !formData.password) {
        throw new Error("Please fill in all required fields");
      }

      // Call the login API function
      await login(formData.email, formData.password);

      // Redirect after successful login
      router.push("/");
    } catch (err: any) {
      console.error("Login failed:", err);

      // Handle different types of errors
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else if (err.response?.data) {
        // Try to extract the error message
        let errorMessage = "Login failed. Please check your credentials.";
        const errorData = err.response.data;

        if (typeof errorData === "object") {
          // Case 1: { "field": ["error1", "error2"] }
          for (const [field, errors] of Object.entries(errorData)) {
            if (Array.isArray(errors) && errors.length > 0) {
              errorMessage = `${field}: ${errors[0]}`;
              break;
            }
          }

          // Case 2: { "non_field_errors": [...] }
          if (
            errorData.non_field_errors &&
            Array.isArray(errorData.non_field_errors)
          ) {
            errorMessage = errorData.non_field_errors[0];
          }
        }

        setError(errorMessage);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow px-4 py-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="form-container bg-gray-800/50 backdrop-blur-md rounded-lg p-8 overflow-hidden">
            <h1 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
              Log In
            </h1>

            {welcomeMessage && (
              <div className="mb-4 p-3 bg-green-900/50 border border-green-500 rounded-md text-green-200">
                {welcomeMessage}
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-md text-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-300 mb-2">
                  Username or Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="text"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input w-full bg-gray-700 px-4 py-2 text-white focus:ring-2 focus:ring-purple-500"
                  placeholder="username or email@example.com"
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="block text-gray-300 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input w-full bg-gray-700 px-4 py-2 text-white focus:ring-2 focus:ring-purple-500"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-medium py-2 px-4 rounded-md transition-all duration-300 ease-in-out hover:from-purple-400 hover:to-cyan-400 hover:scale-105 hover:shadow-[0_0_20px_rgba(139,92,246,0.7)] disabled:opacity-70 disabled:hover:scale-100 disabled:hover:shadow-none"
              >
                {isLoading ? "Logging in..." : "Log In"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Don't have an account?{" "}
                <Link
                  href="/signup"
                  className="text-purple-400 hover:text-purple-300 transition-all duration-300 ease-in-out hover:underline hover:shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
