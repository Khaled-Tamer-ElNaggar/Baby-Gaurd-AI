import React from 'react';
import { Plus } from 'lucide-react';

const AddPhotoButton = () => {
  return (
    <button 
      className="fixed right-4 bottom-20 w-12 h-12 bg-violet-600 rounded-full flex items-center justify-center shadow-lg text-white"
      onClick={() => {
        // Handle photo upload
        console.log('Add photo clicked');
      }}
    >
      <Plus className="w-6 h-6" />
    </button>
  );
};

export default AddPhotoButton;