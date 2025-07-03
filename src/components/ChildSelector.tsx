import React, { useState, useEffect } from 'react';
import { ChevronDown, User, Plus } from 'lucide-react';

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
  const [currentChildId, setCurrentChildId] = useState<string | null>(null); // Initialize as null
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChildren = async () => {
      const token = localStorage.getItem('token');
      console.log('Token:', token); // Debug log
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
          if (response.status === 401) {
            setError('Unauthorized: Please log in again');
            localStorage.removeItem('token');
            localStorage.removeItem('currentChildId'); // Clear on auth failure
          }
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched children data:', data);
        if (!data.children || !Array.isArray(data.children)) {
          throw new Error('Invalid children data format');
        }

        setChildren(data.children);
        setCurrentChildId(data.currentChildId || null); // Set from backend on mount
        if (data.currentChildId) {
          localStorage.setItem('currentChildId', data.currentChildId); // Sync localStorage
        } else {
          localStorage.removeItem('currentChildId');
        }
      } catch (error) {
        console.error('Error fetching children:', error);
        setError(error.message || 'Failed to load children');
        setCurrentChildId(null); // Reset on error
        localStorage.removeItem('currentChildId');
      } finally {
        setIsLoading(false);
      }
    };

    fetchChildren();
  }, []); // Empty dependency array ensures this runs only on mount

  const handleSelectChild = async (child: Child) => {
    console.log('Selected child:', child); // Debug log
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found, please log in');
      setIsOpen(false);
      return;
    }
  
    try {
      setIsLoading(true); // Show loading state during selection
      const response = await fetch('http://localhost:5000/api/children/current', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ currentChildId: child.id })
      });
    
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }
    
      const data = await response.json();
      setCurrentChildId(data.currentChildId); // Update only on user selection
      localStorage.setItem('currentChildId', data.currentChildId); // Update localStorage
      setIsOpen(false);
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error('Error updating current child:', error);
      setError(error.message || 'Failed to update current child');
    } finally {
      setIsLoading(false);
    }
  };

  const currentChild = children.find(child => child.id === currentChildId) || null;
  console.log('Current child:', currentChild, 'Children:', children, 'CurrentChildId:', currentChildId);

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