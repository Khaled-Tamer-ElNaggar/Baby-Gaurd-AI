import React, { useState } from 'react';
import Header from '../../components/Header';
import Navbar from '../../components/Navbar';
import MemoryCard from './components/MemoryCard';
import AddMemoryModal from './components/AddMemoryModal';
import { Plus } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

const Gallery = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { memories, addMemory, deleteMemory, updateMemory } = useData();

  const handleAddMemory = async (memory) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      addMemory({
        photo: reader.result as string,
        caption: memory.caption,
        date: memory.date
      });
    };
    reader.readAsDataURL(memory.photo);
  };

  return (
    <div className="min-h-screen bg-violet-50 dark:bg-gray-900">
      <Header title="Memories" showChildSelector />
      
      <main className="p-4 md:p-6 max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-white dark:bg-gray-800 rounded-2xl p-4 flex items-center justify-center space-x-2 text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-gray-700 transition-colors h-[300px]"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Add New Memory</span>
          </button>

          {memories.map((memory) => (
            <MemoryCard
              key={memory.id}
              {...memory}
              onDelete={deleteMemory}
              onEdit={(id, newCaption) => updateMemory(id, { caption: newCaption })}
            />
          ))}
        </div>
      </main>

      <AddMemoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddMemory}
      />

      <Navbar />
    </div>
  );
};

export default Gallery;