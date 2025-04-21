import React from 'react';
import { MessageSquare, Plus } from 'lucide-react';
import { format } from 'date-fns';

interface ChatHistoryProps {
  conversations: Array<{
    id: string;
    title: string;
    lastMessage: string;
    timestamp: string;
  }>;
  currentConversationId: string;
  onSelect: (id: string) => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({
  conversations,
  currentConversationId,
  onSelect,
}) => {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b dark:border-gray-700">
        <button
          onClick={() => onSelect('new')}
          className="w-full flex items-center justify-center gap-2 p-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
        >
          <Plus className="w-4 h-4" />
          <span>New Chat</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.map((conversation) => (
          <button
            key={conversation.id}
            onClick={() => onSelect(conversation.id)}
            className={`w-full p-4 text-left border-b dark:border-gray-700 hover:bg-violet-50 dark:hover:bg-gray-700 transition-colors ${
              currentConversationId === conversation.id
                ? 'bg-violet-50 dark:bg-gray-700'
                : ''
            }`}
          >
            <div className="flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-violet-600 dark:text-violet-400 mt-1" />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                  {conversation.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {conversation.lastMessage}
                </p>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {format(new Date(conversation.timestamp), 'MMM d, h:mm a')}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatHistory;