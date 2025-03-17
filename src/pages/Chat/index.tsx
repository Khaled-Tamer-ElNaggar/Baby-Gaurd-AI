import React from 'react';
import Header from '../../components/Header';
import Navbar from '../../components/Navbar';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import useChat from './hooks/useChat';

const Chat = () => {
  const { messages, sendMessage } = useChat();

  return (
    <div className="min-h-screen bg-violet-50 dark:bg-gray-900">
      <Header title="Chat with AI" />

      <main className="max-w-lg mx-auto p-4 pb-24">
        <div className="space-y-4 mb-4">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              isAi={message.isAi}
              message={message.text}
              timestamp={message.timestamp}
            />
          ))}
        </div>

        <div className="fixed bottom-16 left-0 right-0 bg-violet-50 dark:bg-gray-900 p-4">
          <div className="max-w-lg mx-auto">
            <ChatInput onSend={sendMessage} />
          </div>
        </div>
      </main>

      <Navbar />
    </div>
  );
};

export default Chat;