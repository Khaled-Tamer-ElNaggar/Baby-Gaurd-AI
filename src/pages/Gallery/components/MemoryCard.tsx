import React, { useState } from 'react';
import { format } from 'date-fns';
import { Heart, MessageCircle, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import EditMemoryModal from './EditMemoryModal';

const getImageUrl = (photo, image) => {
  // Use photo or image, fallback to empty string
  const path = photo || image || '';
  // Extract filename (handles both / and \ as separators)
  const parts = path.split(/[/\\]/);
  const filename = parts[parts.length - 1];
  return `/uploads/${filename}`;
};

const MemoryCard = ({ id, image, photo, caption, date, likes = 0, comments = 0, onDelete, onEdit }) => {
  const [showActions, setShowActions] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm">
      <div className="relative aspect-square">
        <img
          src={getImageUrl(photo, image)}
          alt={caption}
          className="w-full h-full object-cover"
        />
        <button
          onClick={() => setShowActions(!showActions)}
          className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-gray-700"
        >
          <MoreVertical className="w-5 h-5" />
        </button>
        
        {showActions && (
          <>
            <div 
              className="fixed inset-0 z-10"
              onClick={() => setShowActions(false)}
            />
            <div className="absolute top-12 right-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg py-1 z-20 w-36">
              <button
                onClick={() => {
                  setIsEditModalOpen(true);
                  setShowActions(false);
                }}
                className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-violet-50 dark:hover:bg-gray-700"
              >
                <Pencil className="w-4 h-4" />
                <span>Edit Caption</span>
              </button>
              <button
                onClick={() => {
                  onDelete(id);
                  setShowActions(false);
                }}
                className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </>
        )}
      </div>
      
      <div className="p-4 space-y-2">
        <p className="text-sm text-gray-600 dark:text-gray-300">{caption}</p>
        <div className="flex justify-between items-center text-sm">
          <span className="text-violet-600 dark:text-violet-400 font-medium">
            {format(new Date(date), 'MMM d, yyyy')}
          </span>
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400">
              <Heart className="w-4 h-4" />
              <span>{likes}</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400">
              <MessageCircle className="w-4 h-4" />
              <span>{comments}</span>
            </button>
          </div>
        </div>
      </div>

      <EditMemoryModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={(newCaption) => onEdit(id, newCaption)}
        initialCaption={caption}
      />
    </div>
  );
};

export default MemoryCard;