import React, { useState } from 'react';
import { format } from 'date-fns';
import { Edit2, Trash2, MoreVertical, X, Check } from 'lucide-react';
import { Child } from '../../../lib/supabase';
import { useUser } from '../../../contexts/UserContext';

interface ChildCardProps {
  child: Child;
  onEdit: (child: Child) => void;
  onDelete: (id: string) => void;
}

const ChildCard: React.FC<ChildCardProps> = ({ child, onEdit, onDelete }) => {
  const { currentChild, setCurrentChild } = useUser();
  const [showActions, setShowActions] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    
    let years = today.getFullYear() - birth.getFullYear();
    const months = today.getMonth() - birth.getMonth();
    
    if (months < 0 || (months === 0 && today.getDate() < birth.getDate())) {
      years--;
    }
    
    if (years === 0) {
      const monthDiff = (today.getMonth() + 12 - birth.getMonth()) % 12;
      return `${monthDiff} month${monthDiff !== 1 ? 's' : ''}`;
    }
    
    return `${years} year${years !== 1 ? 's' : ''}`;
  };

  const handleSetActive = () => {
    setCurrentChild(child);
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border-2 ${
      currentChild?.id === child.id 
        ? 'border-violet-400 dark:border-violet-500' 
        : 'border-transparent'
    }`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-violet-900 dark:text-violet-200">
            {child.full_name}
          </h3>
          <div className="mt-1 space-y-1">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Age: {calculateAge(child.birth_date)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Birth Date: {format(new Date(child.birth_date), 'MMM d, yyyy')}
            </p>
            {child.gender && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Gender: {child.gender.charAt(0).toUpperCase() + child.gender.slice(1)}
              </p>
            )}
          </div>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 hover:bg-violet-100 dark:hover:bg-gray-700 rounded-full"
          >
            <MoreVertical className="w-5 h-5 text-violet-600 dark:text-violet-400" />
          </button>

          {showActions && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowActions(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg py-1 z-20">
                {currentChild?.id !== child.id && (
                  <button
                    onClick={() => {
                      handleSetActive();
                      setShowActions(false);
                    }}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-gray-700"
                  >
                    <Check className="w-4 h-4" />
                    <span>Set as Active</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    onEdit(child);
                    setShowActions(false);
                  }}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-gray-700"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => {
                    setConfirmDelete(true);
                    setShowActions(false);
                  }}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-sm p-6">
            <h3 className="text-lg font-medium text-violet-900 dark:text-violet-200 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete {child.full_name}'s profile? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete(child.id);
                  setConfirmDelete(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChildCard;