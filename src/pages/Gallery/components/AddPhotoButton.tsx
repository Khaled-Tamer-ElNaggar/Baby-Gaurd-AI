import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import AddMemoryModal from './AddMemoryModal';

const AddPhotoButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button 
        className="fixed right-4 bottom-20 w-12 h-12 bg-violet-600 rounded-full flex items-center justify-center shadow-lg text-white"
        onClick={() => setIsModalOpen(true)}
      >
        <Plus className="w-6 h-6" />
      </button>
      <AddMemoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default AddPhotoButton;