import { formatDistanceToNow } from "date-fns";

interface ChatMessageProps {
  message: {
    id: number;
    role: "user" | "assistant";
    content: string;
    timestamp: string;
  };
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const formattedTime = formatDistanceToNow(new Date(message.timestamp), {
    addSuffix: true,
  });

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 ${
          isUser
            ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white"
            : "bg-gray-800 text-white border border-gray-700"
        }`}
      >
        <div className="flex items-center mb-1">
          <span
            className={`text-xs ${
              isUser ? "text-purple-200" : "text-gray-400"
            }`}
          >
            {isUser ? "You" : "ShopBot"}
          </span>
          <span
            className={`text-xs ml-2 ${
              isUser ? "text-purple-200" : "text-gray-400"
            }`}
          >
            {formattedTime}
          </span>
        </div>
        <div className="whitespace-pre-wrap">{message.content}</div>
      </div>
    </div>
  );
}
