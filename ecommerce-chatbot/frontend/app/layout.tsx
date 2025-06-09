import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";

// Use subsets and display options to stabilize font loading
const geistSans = Geist({
  subsets: ["latin"],
  display: "swap", // Ensure consistent font loading behavior
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap", // Ensure consistent font loading behavior
});

export const metadata: Metadata = {
  title: "ShopBot - Smart E-commerce Assistant",
  description: "E-commerce application with an intelligent chatbot assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.className} ${geistMono.className}`}>
      <body className="antialiased bg-gradient-to-br from-gray-900 to-gray-950 text-white min-h-screen font-[Arial,Helvetica,sans-serif]">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
