import Image from "next/image";
import Link from "next/link";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative min-h-[80vh] flex items-center">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://source.unsplash.com/random/1920x1080/?technology,digital"
              alt="Hero background"
              fill
              priority
              className="object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/95 to-gray-900/90"></div>
          </div>

          <div className="container mx-auto px-4 z-10">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
                Shopping Made Smarter with AI
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Experience the future of e-commerce with our intelligent
                shopping assistant. Find products, get recommendations, and make
                purchases with ease.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/chatbot"
                  className="px-6 py-3 rounded-md bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-medium text-center transition-all duration-300 ease-in-out hover:from-purple-400 hover:to-cyan-400 hover:scale-105 hover:shadow-[0_0_20px_rgba(139,92,246,0.7)]"
                >
                  Try the Chatbot
                </Link>
                <Link
                  href="/products"
                  className="px-6 py-3 rounded-md border border-gray-700 text-white font-medium text-center transition-all duration-300 ease-in-out hover:bg-gray-800 hover:scale-105 hover:border-purple-500 hover:shadow-[0_0_15px_rgba(139,92,246,0.5)]"
                >
                  Browse Products
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-900/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
              Intelligent Shopping Features
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-lg border border-gray-700 transition-all duration-300 ease-in-out hover:scale-105 hover:border-purple-500 hover:shadow-[0_0_20px_rgba(139,92,246,0.5)]">
                <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-purple-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Smart Search
                </h3>
                <p className="text-gray-400">
                  Find exactly what you're looking for with our intelligent
                  search capabilities. Just describe what you need in natural
                  language.
                </p>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-lg border border-gray-700 transition-all duration-300 ease-in-out hover:scale-105 hover:border-cyan-500 hover:shadow-[0_0_20px_rgba(34,211,238,0.5)]">
                <div className="h-12 w-12 rounded-full bg-cyan-500/20 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-cyan-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Personalized Recommendations
                </h3>
                <p className="text-gray-400">
                  Get product recommendations tailored to your preferences and
                  shopping history for a customized shopping experience.
                </p>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-lg border border-gray-700 transition-all duration-300 ease-in-out hover:scale-105 hover:border-purple-500 hover:shadow-[0_0_20px_rgba(139,92,246,0.5)]">
                <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-purple-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Interactive Assistant
                </h3>
                <p className="text-gray-400">
                  Chat with our AI assistant to get help with your shopping
                  needs, answer questions, and guide you through the purchasing
                  process.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
              Ready to Transform Your Shopping Experience?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have revolutionized
              their shopping with our AI-powered assistant.
            </p>
            <Link
              href="/signup"
              className="inline-block px-8 py-4 rounded-md bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-medium text-center transition-all duration-300 ease-in-out hover:from-purple-400 hover:to-cyan-400 hover:scale-110 hover:shadow-[0_0_25px_rgba(139,92,246,0.7)]"
            >
              Get Started Now
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
