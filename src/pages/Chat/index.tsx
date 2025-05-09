import React, { useState } from 'react';
import Header from '../../components/Header';
import Navbar from '../../components/Navbar';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import ChatHistory from './components/ChatHistory';
import useChat from './hooks/useChat';
import { Menu, X } from 'lucide-react';

const Chat = () => {
  const { 
    messages, 
    conversations, 
    sendMessage, 
    selectConversation, 
    deleteConversation,
    currentConversationId 
  } = useChat();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  return (
    <div className="min-h-screen bg-violet-50 dark:bg-gray-900">
      <Header title="Chat with AI">
        <button
          onClick={() => setIsHistoryOpen(!isHistoryOpen)}
          className="md:hidden p-2 hover:bg-violet-100 dark:hover:bg-gray-700 rounded-full"
        >
          {isHistoryOpen ? (
            <X className="w-5 h-5 text-violet-600 dark:text-violet-400" />
          ) : (
            <Menu className="w-5 h-5 text-violet-600 dark:text-violet-400" />
          )}
        </button>
      </Header>

      <div className="relative">
        {/* Mobile Chat History Overlay */}
        <div
          className={`fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity ${
            isHistoryOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsHistoryOpen(false)}
        />

        <div className="flex">
          {/* Chat History Sidebar */}
          <div
            className={`fixed md:static left-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-800 z-40 
                       transition-transform duration-300 md:transition-none
                       ${isHistoryOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
          >
            <ChatHistory
              conversations={conversations}
              currentConversationId={currentConversationId}
              onSelect={(id) => {
                selectConversation(id);
                setIsHistoryOpen(false);
              }}
              onDelete={deleteConversation}
            />
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 h-[calc(100vh-8rem)] md:ml-0">
            <div className="relative h-full">
              <div className="absolute inset-0 flex flex-col">
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="max-w-lg mx-auto space-y-4">
                    {messages.map((message) => (
                      <ChatMessage
                        key={message.id}
                        id={message.id}
                        isAi={message.isAi}
                        message={message.text}
                        timestamp={message.timestamp}
                      />
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-violet-50 dark:bg-gray-900">
                  <div className="max-w-lg mx-auto">
                    <ChatInput onSend={sendMessage} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Navbar />
    </div>
  );
};

export default Chat;