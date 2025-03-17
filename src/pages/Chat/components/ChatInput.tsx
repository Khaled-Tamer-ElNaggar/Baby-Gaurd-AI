import React, { useState } from 'react';
import { Send } from 'lucide-react';

type ChatInputProps = {
  onSend: (message: string) => void;
};

const ChatInput = ({ onSend }: ChatInputProps) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-violet-400 dark:focus:border-violet-500"
      />
      <button
        type="submit"
        className="p-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700 dark:hover:bg-violet-500"
      >
        <Send className="w-5 h-5" />
      </button>
    </form>
  );
};
export default ChatInput;