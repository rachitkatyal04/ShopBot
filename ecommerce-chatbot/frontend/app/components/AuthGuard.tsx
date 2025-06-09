"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { checkAuth } from "../lib/api";

// Pages that don't require authentication
const publicPages = ["/login", "/signup", "/", "/products"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Use this to prevent hydration errors - component will only render after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const validateAuth = async () => {
      try {
        // Skip auth check for public pages
        if (
          publicPages.some((page) => pathname?.startsWith(page)) ||
          pathname === "/"
        ) {
          setIsLoading(false);
          return;
        }

        // Check if token exists (safely check localStorage only in browser)
        const token = localStorage.getItem("token");

        if (!token) {
          router.push("/login");
          return;
        }

        // Validate token with API
        const isValid = await checkAuth();
        if (!isValid) {
          router.push("/login");
          return;
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error("Auth validation error:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    validateAuth();
  }, [pathname, router, mounted]);

  // Only render content after component has mounted to prevent hydration errors
  if (!mounted) {
    return <>{children}</>;
  }

  // Public pages are always accessible
  const isPublicPage =
    publicPages.some((page) => pathname?.startsWith(page)) || pathname === "/";

  // If on a protected page and not authenticated, show nothing while redirecting
  if (!isAuthenticated && !isPublicPage) {
    return isLoading ? (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-xl text-purple-400">Loading...</div>
      </div>
    ) : null;
  }

  // Show children if authenticated or on a public page
  return <>{children}</>;
}
