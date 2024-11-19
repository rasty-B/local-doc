import React from 'react';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: string;
  isBot: boolean;
  timestamp: Date;
}

export default function ChatMessage({ message, isBot, timestamp }: ChatMessageProps) {
  return (
    <div className={`flex gap-4 p-4 rounded-lg ${isBot ? 'bg-gray-800' : 'bg-gray-800'}`}>
      <div className="flex-shrink-0">
        {isBot ? (
          <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center">
            <Bot className="w-5 h-5 text-blue-300" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-green-900 flex items-center justify-center">
            <User className="w-5 h-5 text-green-300" />
          </div>
        )}
      </div>
      <div className="flex-1">
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300 whitespace-pre-wrap">{message}</p>
        </div>
        <span className="text-xs text-gray-500 mt-1">
          {timestamp.toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}