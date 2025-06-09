"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Import AuthGuard with dynamic import
const AuthGuard = dynamic(() => import("./components/AuthGuard"), {
  ssr: false,
  loading: () => (
    <>{/* Return empty fragment to ensure identical server/client output */}</>
  ),
});

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Use this to prevent hydration errors by only rendering after client-side mount
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // During SSR or before hydration, return children directly without AuthGuard
  if (!isMounted) {
    return <>{children}</>;
  }

  // After client-side hydration, wrap with AuthGuard
  return <AuthGuard>{children}</AuthGuard>;
}
