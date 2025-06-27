import { useState, useEffect } from 'react';

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
  summary?: string;
};

const API_BASE_URL = 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token') || '';

const useChat = () => {
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchConversations = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat-sessions`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setConversations(
          data.sessions.map((sess: any) => ({
            id: sess.session_uuid,
            title: sess.session_topic,
            lastMessage: sess.summary || 'No messages yet',
            timestamp: sess.start_time,
            summary: sess.summary,
          }))
        );
        if (data.sessions.length > 0 && !currentConversationId) {
          setCurrentConversationId(data.sessions[0].session_uuid);
        }
      } else {
        console.error('Failed to fetch conversations:', data.error);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const fetchMessages = async (sessionId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/chat-sessions/${sessionId}/messages?page=1&per_page=50`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setMessages(
          data.messages.map((msg: any) => ({
            id: msg.id.toString(),
            text: msg.content,
            isAi: msg.sender === 'assistant',
            timestamp: new Date(msg.created_at).toLocaleTimeString(),
            conversationId: sessionId,
          }))
        );
      } else {
        console.error('Failed to fetch messages:', data.error);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (currentConversationId) {
      fetchMessages(currentConversationId);
    } else {
      setMessages([]);
    }
  }, [currentConversationId]);

  const sendMessage = async (text: string) => {
    if (!currentConversationId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isAi: false,
      timestamp: new Date().toLocaleTimeString(),
      conversationId: currentConversationId,
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await fetch(
        `${API_BASE_URL}/chat-sessions/${currentConversationId}/send`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${getToken()}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: text }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          isAi: true,
          timestamp: new Date().toLocaleTimeString(),
          conversationId: currentConversationId,
        };
        setMessages((prev) => [...prev, aiMessage]);
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === currentConversationId
              ? { ...conv, lastMessage: data.response, timestamp: new Date().toISOString() }
              : conv
          )
        );
      } else {
        console.error('Failed to send message:', data.error);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // In useChat.ts, modify deleteConversation
  const deleteConversation = async (conversationId: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/chat-sessions/${conversationId}`, // Updated endpoint
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setConversations((prev) => prev.filter((conv) => conv.id !== conversationId));
        setMessages((prev) => prev.filter((msg) => msg.conversationId !== conversationId));
        if (currentConversationId === conversationId) {
          const remainingConversations = conversations.filter(
            (conv) => conv.id !== conversationId
          );
          if (remainingConversations.length > 0) {
            setCurrentConversationId(remainingConversations[0].id);
          } else {
            selectConversation('new');
          }
        }
      } else {
        console.error('Failed to delete conversation:', data.error);
        alert(`Failed to delete conversation: ${data.error}`);
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
      alert('An error occurred while deleting the conversation. Please try again.');
    }
  };

  const selectConversation = async (id: string) => {
    if (id === 'new') {
      try {
        const response = await fetch(`${API_BASE_URL}/chat-sessions`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${getToken()}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (response.ok) {
          const newConversation: Conversation = {
            id: data.session_uuid,
            title: 'New Chat',
            lastMessage: 'Start a new conversation',
            timestamp: new Date().toISOString(),
          };
          setConversations((prev) => [newConversation, ...prev]);
          setCurrentConversationId(data.session_uuid);
          setMessages([]);
        } else {
          console.error('Failed to create new conversation:', data.error);
        }
      } catch (error) {
        console.error('Error creating new conversation:', error);
      }
    } else {
      setCurrentConversationId(id);
    }
  };

  const updateConversationTopic = async (conversationId: string, topic: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/chat-sessions/${conversationId}/update-topic`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${getToken()}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ topic }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === conversationId ? { ...conv, title: topic } : conv
          )
        );
      } else {
        console.error('Failed to update topic:', data.error);
      }
    } catch (error) {
      console.error('Error updating topic:', error);
    }
  };

  return {
    messages,
    isLoading,
    conversations,
    currentConversationId,
    sendMessage,
    deleteConversation,
    selectConversation,
    updateConversationTopic,
  };
};

export default useChat;