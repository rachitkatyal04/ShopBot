"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { register } from "../lib/api";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
    setSuccess("");
    setIsLoading(true);

    try {
      // Validate form
      if (!formData.name || !formData.email || !formData.password) {
        throw new Error("Please fill in all required fields");
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      if (formData.password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }

      // Create username from email if it doesn't contain invalid characters
      const username = formData.email
        .split("@")[0]
        .replace(/[^a-zA-Z0-9_]/g, "_");

      // Split name into first and last name
      const nameParts = formData.name.trim().split(/\s+/);
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      // Prepare registration data exactly as expected by Django UserSerializer
      const registrationData = {
        username: username,
        email: formData.email,
        password: formData.password,
        first_name: firstName,
        last_name: lastName,
        profile: {}, // Django will create a profile via signals
      };

      // Use the register API function
      await register(registrationData);

      // Set success message
      setSuccess(
        "Registration successful! Please log in with your new account."
      );

      // Clear the form
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        router.push("/login?registered=true");
      }, 2000);
    } catch (err: any) {
      console.error("Registration failed:", err);

      // Handle different types of errors
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else if (err.response?.data) {
        // Handle validation errors
        console.error("Validation error details:", err.response.data);

        // If the error data is empty, show a more helpful message
        if (Object.keys(err.response.data).length === 0) {
          setError(
            "The server rejected the registration but didn't provide details. Please try a different username or email."
          );
        } else {
          // Try to extract the error message
          let errorMessage = "Signup failed. Please check your information.";
          const errorData = err.response.data;

          // Look for common Django error patterns
          if (typeof errorData === "object") {
            // Case 1: { "field": ["error1", "error2"] }
            for (const [field, errors] of Object.entries(errorData)) {
              if (Array.isArray(errors) && errors.length > 0) {
                errorMessage = `${field}: ${errors[0]}`;
                break;
              }
            }

            // Case 2: { "field": "error" }
            if (
              errorMessage === "Signup failed. Please check your information."
            ) {
              for (const [field, error] of Object.entries(errorData)) {
                if (typeof error === "string") {
                  errorMessage = `${field}: ${error}`;
                  break;
                }
              }
            }

            // Case 3: { "non_field_errors": [...] }
            if (
              errorData.non_field_errors &&
              Array.isArray(errorData.non_field_errors)
            ) {
              errorMessage = errorData.non_field_errors[0];
            }
          }

          setError(errorMessage);
        }
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Signup failed. Please try again.");
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
              Create an Account
            </h1>

            {error && (
              <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-md text-red-200">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-900/50 border border-green-500 rounded-md text-green-200">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input w-full bg-gray-700 px-4 py-2 text-white focus:ring-2 focus:ring-purple-500"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-300 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input w-full bg-gray-700 px-4 py-2 text-white focus:ring-2 focus:ring-purple-500"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div className="mb-4">
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
                <p className="text-xs text-gray-400 mt-1">
                  Password must be at least 8 characters long
                </p>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="confirmPassword"
                  className="block text-gray-300 mb-2"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
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
                {isLoading ? "Creating Account..." : "Sign Up"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-purple-400 hover:text-purple-300 transition-all duration-300 ease-in-out hover:underline hover:shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                >
                  Log in
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
