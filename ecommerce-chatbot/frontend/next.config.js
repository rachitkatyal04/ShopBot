/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output the standalone Next.js build for better Railway compatibility
  output: "standalone",

  // Specify allowed image domains for the Next.js Image component
  images: {
    domains: [
      "images.unsplash.com",
      "source.unsplash.com",
      "picsum.photos",
      "localhost",
      "railway.app",
    ],
  },

  // Environment variables to be available at build time
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },

  // Disable strictMode in production for better performance
  reactStrictMode: process.env.NODE_ENV !== "production",
};

module.exports = nextConfig;
