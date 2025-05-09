import React from 'react';

type MessageProps = {
  id: string;
  isAi: boolean;
  message: string;
  timestamp: string;
};

const ChatMessage = ({ id, isAi, message, timestamp }: MessageProps) => {
  return (
    <div className={`flex ${isAi ? 'justify-start' : 'justify-end'} mb-4`}>
      <div
        className={`max-w-[80%] rounded-2xl p-4 ${
          isAi
            ? 'bg-white dark:bg-gray-800 text-violet-900 dark:text-violet-200'
            : 'bg-violet-600 text-white'
        }`}
      >
        <p className="text-sm">{message}</p>
        <span className={`text-xs mt-1 block ${isAi ? 'text-gray-500 dark:text-gray-400' : 'text-violet-200'}`}>
          {timestamp}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;