import React from 'react';
import { MessageSquare, Plus, Trash2 } from 'lucide-react';
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
  onDelete: (id: string) => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({
  conversations,
  currentConversationId,
  onSelect,
  onDelete,
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
          <div
            key={conversation.id}
            className={`w-full p-4 text-left border-b dark:border-gray-700 hover:bg-violet-50 dark:hover:bg-gray-700 transition-colors ${
              currentConversationId === conversation.id
                ? 'bg-violet-50 dark:bg-gray-700'
                : ''
            }`}
          >
            <div className="flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-violet-600 dark:text-violet-400 mt-1" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                    {conversation.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onDelete(conversation.id)}
                      className="text-red-500 hover:text-red-600 dark:hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onSelect(conversation.id)}
                      className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300"
                    >
                      View
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {conversation.lastMessage}
                </p>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {format(new Date(conversation.timestamp), 'MMM d, h:mm a')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatHistory;