import React, { useState } from 'react';
import { ChevronDown, User, Plus } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { Child } from '../lib/supabase';

interface ChildSelectorProps {
  showAddButton?: boolean;
  onAddClick?: () => void;
}

const ChildSelector: React.FC<ChildSelectorProps> = ({ 
  showAddButton = false,
  onAddClick
}) => {
  const { children, currentChild, setCurrentChild } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  if (children.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-violet-100 dark:bg-violet-900/30 rounded-full text-violet-800 dark:text-violet-300 hover:bg-violet-200 dark:hover:bg-violet-900/50 transition-colors"
      >
        <User className="w-4 h-4" />
        <span className="text-sm font-medium">{currentChild?.name || 'Select Child'}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg py-1 z-20">
            {children.map((child) => (
              <button
                key={child.id}
                onClick={() => {
                  setCurrentChild(child);
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-violet-50 dark:hover:bg-gray-700 ${
                  currentChild?.id === child.id 
                    ? 'bg-violet-50 dark:bg-gray-700 text-violet-700 dark:text-violet-300' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {child.name}
              </button>
            ))}
            
            {showAddButton && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  if (onAddClick) onAddClick();
                }}
                className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-gray-700 border-t border-gray-100 dark:border-gray-700 mt-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add Child</span>
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ChildSelector;