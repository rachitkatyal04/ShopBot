import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ChatInterface from "../components/ChatInterface";

export default function ChatbotPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
            ShopBot Assistant
          </h1>

          <p className="text-gray-300 mb-4">
            Chat with our AI shopping assistant to find products, get
            recommendations, and simulate purchases. Just type your request in
            natural language.
          </p>

          <p className="text-gray-300 mb-6">
            <span className="font-medium text-purple-400">New!</span> For
            logged-in users, all your conversations are now stored
            automatically. Click the "Show History" button to access your
            previous chats and continue any conversation from where you left
            off.
          </p>

          <ChatInterface />
        </div>
      </main>

      <Footer />
    </div>
  );
}
