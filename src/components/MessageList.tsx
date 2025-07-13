
import type { ChatMessage } from "../types";
import MessageBubble from "./MessageBubble";


interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

export default function MessageList({ messages, isLoading }: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          id={message.id}
          type={message.type}
          content={message.content}
          citations={message.citations}
          timestamp={message.timestamp}
        />
      ))}

      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-white rounded-lg p-4 max-w-3xl shadow-md">
            <div className="flex items-center space-x-3">
              <div className="animate-pulse rounded-full bg-blue-200 h-3 w-3"></div>
              <div className="animate-pulse rounded-full bg-blue-200 h-3 w-3 delay-150"></div>
              <div className="animate-pulse rounded-full bg-blue-200 h-3 w-3 delay-300"></div>
              <span className="text-gray-600 font-medium">Lexi is thinking...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

