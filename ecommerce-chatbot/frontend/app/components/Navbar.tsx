"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "../lib/api";

export default function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const isActive = (path: string) => {
    return pathname === path;
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsLoggedIn(false);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 w-full">
      <div className="w-full flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="flex items-center transition-transform duration-300 hover:scale-110"
            >
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-400 hover:from-purple-400 hover:to-cyan-300">
                ShopBot
              </span>
            </Link>
          </div>
        </div>

        <div className="hidden md:flex justify-center">
          <div className="flex items-center space-x-6">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out hover:scale-110 ${
                isActive("/")
                  ? "bg-gray-800 text-white shadow-lg"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white hover:shadow-[0_0_15px_rgba(139,92,246,0.5)]"
              }`}
            >
              Home
            </Link>
            <Link
              href="/products"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out hover:scale-110 ${
                isActive("/products")
                  ? "bg-gray-800 text-white shadow-lg"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white hover:shadow-[0_0_15px_rgba(139,92,246,0.5)]"
              }`}
            >
              Products
            </Link>
            <Link
              href="/chatbot"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out hover:scale-110 ${
                isActive("/chatbot")
                  ? "bg-gray-800 text-white shadow-lg"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white hover:shadow-[0_0_15px_rgba(139,92,246,0.5)]"
              }`}
            >
              Chatbot
            </Link>
          </div>
        </div>

        <div className="hidden md:block">
          <div className="flex items-center">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-md text-sm font-medium text-gray-300 transition-all duration-300 ease-in-out hover:bg-gray-700 hover:text-white hover:scale-110 hover:shadow-[0_0_15px_rgba(139,92,246,0.5)]"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-md text-sm font-medium text-gray-300 transition-all duration-300 ease-in-out hover:bg-gray-700 hover:text-white hover:scale-110 hover:shadow-[0_0_15px_rgba(139,92,246,0.5)]"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="ml-2 px-4 py-2 rounded-md text-sm font-medium bg-gradient-to-r from-purple-500 to-cyan-500 text-white transition-all duration-300 ease-in-out hover:from-purple-400 hover:to-cyan-400 hover:scale-110 hover:shadow-[0_0_20px_rgba(139,92,246,0.7)]"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="flex md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 transition-all duration-300 ease-in-out hover:text-white hover:bg-gray-700 hover:scale-110 hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
          >
            <span className="sr-only">Open main menu</span>
            {!isMenuOpen ? (
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            ) : (
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ease-in-out hover:scale-105 ${
                isActive("/")
                  ? "bg-gray-800 text-white shadow-lg"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white hover:shadow-[0_0_15px_rgba(139,92,246,0.5)]"
              }`}
            >
              Home
            </Link>
            <Link
              href="/products"
              className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ease-in-out hover:scale-105 ${
                isActive("/products")
                  ? "bg-gray-800 text-white shadow-lg"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white hover:shadow-[0_0_15px_rgba(139,92,246,0.5)]"
              }`}
            >
              Products
            </Link>
            <Link
              href="/chatbot"
              className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ease-in-out hover:scale-105 ${
                isActive("/chatbot")
                  ? "bg-gray-800 text-white shadow-lg"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white hover:shadow-[0_0_15px_rgba(139,92,246,0.5)]"
              }`}
            >
              Chatbot
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            <div className="px-2 space-y-1">
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 transition-all duration-300 ease-in-out hover:bg-gray-700 hover:text-white hover:scale-105 hover:shadow-[0_0_15px_rgba(139,92,246,0.5)]"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 transition-all duration-300 ease-in-out hover:bg-gray-700 hover:text-white hover:scale-105 hover:shadow-[0_0_15px_rgba(139,92,246,0.5)]"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="block px-3 py-2 rounded-md text-base font-medium bg-gradient-to-r from-purple-500 to-cyan-500 text-white transition-all duration-300 ease-in-out hover:from-purple-400 hover:to-cyan-400 hover:scale-105 hover:shadow-[0_0_20px_rgba(139,92,246,0.7)] mt-2"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
