
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
          <div className="bg-gray-100 rounded-lg p-4 max-w-3xl">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-gray-600">Thinking...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

