import React from "react";

interface MessageInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export default function MessageInput({
  inputValue,
  setInputValue,
  handleSubmit,
  isLoading,
}: MessageInputProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white to-transparent p-4">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="flex space-x-4 items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask a legal question..."
            className="flex-1 p-4 border-2 border-gray-300 rounded-full focus:outline-none focus:border-blue-500 shadow-sm transition-shadow focus:shadow-md"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="px-8 py-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg transform transition-transform hover:scale-105"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}

