import React, { useState } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import type { ChatMessage, Citation } from '../types';


interface MockResponse {
  answer: string;
  citations: Citation[];
}

const mockApi = async (): Promise<MockResponse> => {
  await new Promise(resolve => setTimeout(resolve, 1500));

  return {
    answer:
      "Yes, under Section 166 of the Motor Vehicles Act, 1988, compensation can be claimed for motor vehicle accidents. The compensation amount depends on various factors including the age of the deceased, their income, and the circumstances of the accident.",
    citations: [
      {
        text: "The compensation amount is determined based on various factors, including the age of the deceased, their income, and the number of dependents. The court aims to provide a just and reasonable amount to the claimants.",
        source: "Dani_Devi_v_Pritam_Singh.pdf",
        pdfUrl: "/example.pdf",
        highlightText: "By way of present appeal, the appellants have questioned the",
      },
    ],
  };
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await mockApi();

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.answer,
        citations: response.citations,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative h-full w-full">
      <div className="flex flex-col h-full">
        <MessageList messages={messages} isLoading={isLoading} />
        <MessageInput
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

