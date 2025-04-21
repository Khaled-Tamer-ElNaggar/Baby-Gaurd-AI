import { useState } from 'react';

type Message = {
  id: string;
  text: string;
  isAi: boolean;
  timestamp: string;
  conversationId: string;
};

type Conversation = {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
};

export const useChat = () => {
  const [currentConversationId, setCurrentConversationId] = useState('1');
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      title: 'Pregnancy Health Tips',
      lastMessage: "Hello! I'm your pregnancy assistant. How can I help you today?",
      timestamp: new Date().toISOString(),
    },
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your pregnancy assistant. How can I help you today?",
      isAi: true,
      timestamp: new Date().toLocaleTimeString(),
      conversationId: '1',
    },
  ]);

  const sendMessage = (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isAi: false,
      timestamp: new Date().toLocaleTimeString(),
      conversationId: currentConversationId,
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Update conversation last message
    setConversations(prev => 
      prev.map(conv => 
        conv.id === currentConversationId
          ? { ...conv, lastMessage: text, timestamp: new Date().toISOString() }
          : conv
      )
    );

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm here to help you with any questions about your pregnancy journey.",
        isAi: true,
        timestamp: new Date().toLocaleTimeString(),
        conversationId: currentConversationId,
      };
      setMessages(prev => [...prev, aiMessage]);
      
      // Update conversation last message with AI response
      setConversations(prev => 
        prev.map(conv => 
          conv.id === currentConversationId
            ? { ...conv, lastMessage: aiMessage.text, timestamp: new Date().toISOString() }
            : conv
        )
      );
    }, 1000);
  };

  const selectConversation = (id: string) => {
    if (id === 'new') {
      const newId = Date.now().toString();
      const newConversation: Conversation = {
        id: newId,
        title: 'New Conversation',
        lastMessage: 'Start a new conversation',
        timestamp: new Date().toISOString(),
      };
      setConversations(prev => [newConversation, ...prev]);
      setCurrentConversationId(newId);
      setMessages([]);
    } else {
      setCurrentConversationId(id);
      // Filter messages for selected conversation
      // In a real app, you'd fetch messages from the server here
    }
  };

  return {
    messages: messages.filter(m => m.conversationId === currentConversationId),
    conversations,
    currentConversationId,
    sendMessage,
    selectConversation,
  };
};

export default useChat;