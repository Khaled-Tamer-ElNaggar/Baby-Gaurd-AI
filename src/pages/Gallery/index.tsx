import React, { useState } from 'react';
import Header from '../../components/Header';
import Navbar from '../../components/Navbar';
import MemoryCard from './components/MemoryCard';
import AddMemoryModal from './components/AddMemoryModal';
import { Plus } from 'lucide-react';

const Gallery = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [memories, setMemories] = useState([]);

  const handleAddMemory = (memory) => {
    const newMemory = {
      id: Date.now(),
      image: URL.createObjectURL(memory.photo),
      caption: memory.caption,
      date: memory.date,
      likes: 0,
      comments: 0
    };
    setMemories([newMemory, ...memories]);
  };

  const handleDeleteMemory = (id: number) => {
    setMemories(memories.filter(memory => memory.id !== id));
  };

  const handleEditMemory = (id: number, newCaption: string) => {
    setMemories(memories.map(memory => 
      memory.id === id ? { ...memory, caption: newCaption } : memory
    ));
  };

  return (
    <div className="min-h-screen bg-violet-50 dark:bg-gray-900">
      <Header title="Memories" showChildSelector />
      
      <main className="max-w-lg mx-auto p-4 pb-24">
        <div className="grid grid-cols-1 gap-4">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-white dark:bg-gray-800 rounded-2xl p-4 flex items-center justify-center space-x-2 text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Add New Memory</span>
          </button>

          {memories.map((memory) => (
            <MemoryCard
              key={memory.id}
              {...memory}
              onDelete={handleDeleteMemory}
              onEdit={handleEditMemory}
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