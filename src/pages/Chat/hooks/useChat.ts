import { useState } from 'react';

type Message = {
  id: string;
  text: string;
  isAi: boolean;
  timestamp: string;
};

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your pregnancy assistant. How can I help you today?",
      isAi: true,
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  const sendMessage = (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isAi: false,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm here to help you with any questions about your pregnancy journey.",
        isAi: true,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  return {
    messages,
    sendMessage,
  };
};

export default useChat;