"use client";

import { useState, useEffect } from "react";
import { fetchChatHistory, deleteChatSession } from "../lib/api";
import { formatDistanceToNow } from "date-fns";

interface ChatSession {
  id: number;
  session_id: string;
  created_at: string;
  updated_at: string;
  messages: {
    id: number;
    role: "user" | "assistant";
    content: string;
    timestamp: string;
  }[];
}

export default function ChatHistory({
  onSelectSession,
  onDeleteSession,
}: {
  onSelectSession: (sessionId: number) => void;
  onDeleteSession: (sessionId: number) => Promise<void>;
}) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [deletingSession, setDeletingSession] = useState<number | null>(null);

  useEffect(() => {
    // Check if user is authenticated
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);

      if (token) {
        loadChatHistory();
      } else {
        setLoading(false);
      }
    }
  }, []);

  const loadChatHistory = async () => {
    try {
      setLoading(true);
      const data = await fetchChatHistory();
      setSessions(data);
      setError(null);
    } catch (err) {
      console.error("Failed to load chat history:", err);
      setError("Failed to load chat history. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSession = async (
    e: React.MouseEvent,
    sessionId: number
  ) => {
    e.stopPropagation(); // Prevent clicking the parent button

    try {
      setDeletingSession(sessionId);
      await onDeleteSession(sessionId);

      // Remove from local state
      setSessions((prev) => prev.filter((session) => session.id !== sessionId));
    } catch (err) {
      console.error("Failed to delete chat session:", err);
      setError("Failed to delete chat session. Please try again.");
    } finally {
      setDeletingSession(null);
    }
  };

  // Extract the first message from each side to create a preview
  const getSessionPreview = (session: ChatSession) => {
    if (!session.messages || session.messages.length === 0) {
      return "New conversation";
    }

    // Get the first few characters of the first user message
    const userMessage = session.messages.find((msg) => msg.role === "user");
    if (userMessage) {
      const preview = userMessage.content.slice(0, 30);
      return preview.length < userMessage.content.length
        ? `${preview}...`
        : preview;
    }

    return "New conversation";
  };

  // Get the number of actual messages (excluding empty sessions)
  const getMessageCount = (session: ChatSession) => {
    if (!session.messages || session.messages.length === 0) {
      return 0;
    }

    // Only count messages with actual content
    const realMessages = session.messages.filter(
      (msg) => msg.content && msg.content.trim().length > 0
    );

    return realMessages.length;
  };

  if (!isAuthenticated) {
    return (
      <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
        <p className="text-gray-400 text-center">
          Please log in to view your chat history
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
        <p className="text-gray-400 text-center">Loading chat history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
        <p className="text-red-400 text-center">{error}</p>
        <button
          onClick={loadChatHistory}
          className="mt-2 w-full bg-gray-700 hover:bg-gray-600 text-white py-1 px-3 rounded transition-all duration-300"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
        <p className="text-gray-400 text-center">No chat history found</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      <h3 className="p-3 bg-gray-900 text-white font-medium border-b border-gray-700">
        Chat History
      </h3>
      <div className="divide-y divide-gray-700 max-h-[400px] overflow-y-auto">
        {sessions.map((session) => (
          <div key={session.id} className="relative group">
            <button
              onClick={() => onSelectSession(session.id)}
              className="w-full text-left p-3 hover:bg-gray-700 transition-colors duration-200 pr-10"
            >
              <div className="flex justify-between items-start mb-1">
                <p className="text-white text-sm font-medium truncate max-w-[65%]">
                  {getSessionPreview(session)}
                </p>
                <span className="text-xs text-gray-400 whitespace-nowrap ml-2 mr-7">
                  {formatDistanceToNow(new Date(session.updated_at), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              <p className="text-gray-400 text-xs">
                {getMessageCount(session)} message
                {getMessageCount(session) !== 1 ? "s" : ""}
              </p>
            </button>
            <button
              onClick={(e) => handleDeleteSession(e, session.id)}
              disabled={deletingSession === session.id}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 border-0 outline-none bg-transparent"
              title="Delete chat"
            >
              {deletingSession === session.id ? (
                <span className="w-5 h-5 block animate-spin rounded-full border-2 border-gray-300 border-t-red-400"></span>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 hover:text-red-500 hover:scale-110 hover:drop-shadow-[0_0_4px_rgba(248,113,113,0.5)] transition-all duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
