import React, { useState, useEffect } from 'react';
import { ChevronDown, User, Plus } from 'lucide-react';

// Update the Child interface to match the children.py API response
interface Child {
  id: string;
  full_name: string;
  birth_date: string;
  birth_weight?: number | null;
  birth_height?: number | null;
  gender?: string;
  blood_type?: string | null;
  genetic_conditions?: string | null;
}

interface ChildSelectorProps {
  showAddButton?: boolean;
  onAddClick?: () => void;
}

const ChildSelector: React.FC<ChildSelectorProps> = ({ 
  showAddButton = false,
  onAddClick
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [children, setChildren] = useState<Child[]>([]);
  const [currentChildId, setCurrentChildId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch children from API
  useEffect(() => {
    const fetchChildren = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to view children');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:5000/api/children', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched children data:', data); // Debug log
        if (!data.children || !Array.isArray(data.children)) {
          throw new Error('Invalid children data format');
        }

        setChildren(data.children);
        // Set currentChildId to first child if none is set or if currentChildId is invalid
        if (data.children.length > 0) {
          const validChildId = data.children.find((child: Child) => child.id === data.currentChildId)
            ? data.currentChildId
            : data.children[0].id;
          setCurrentChildId(validChildId);
          localStorage.setItem('currentChildId', validChildId); // Sync with localStorage
        } else {
          setCurrentChildId(null);
          localStorage.removeItem('currentChildId');
        }
      } catch (error) {
        console.error('Error fetching children:', error);
        setError('Failed to load children');
      } finally {
        setIsLoading(false);
      }
    };

    fetchChildren();
  }, []);

  const handleSelectChild = async (child: Child) => {
    console.log('Selected child:', child); // Debug log
    setCurrentChildId(child.id);
    setIsOpen(false);
    localStorage.setItem('currentChildId', child.id);
  };

  const currentChild = children.find(child => child.id === currentChildId) || null;
  console.log('Current child:', currentChild, 'Children:', children, 'CurrentChildId:', currentChildId); // Debug log

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading || !!error}
        className={`flex items-center gap-2 px-3 py-1.5 bg-violet-100 dark:bg-violet-900/30 rounded-full text-violet-800 dark:text-violet-300 hover:bg-violet-200 dark:hover:bg-violet-900/50 transition-colors ${
          isLoading || error ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <User className="w-4 h-4" />
        <span className="text-sm font-medium">
          {error ? error : isLoading ? 'Loading...' : currentChild?.full_name || 'No Child Selected'}
        </span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && !isLoading && !error && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg py-1 z-20">
            {children.length > 0 ? (
              children.map((child) => (
                <button
                  key={child.id}
                  onClick={() => handleSelectChild(child)}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-violet-50 dark:hover:bg-gray-700 ${
                    currentChild?.id === child.id 
                      ? 'bg-violet-50 dark:bg-gray-700 text-violet-700 dark:text-violet-300' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {child.full_name || 'Unnamed Child'}
                </button>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">
                No children found
              </div>
            )}
            
            {showAddButton && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  onAddClick?.();
                }}
                className="flex items sparing gap-2 w-full text-left px-4 py-2 text-sm text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-gray-700 border-t border-gray-100 dark:border-gray-700 mt-1"
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