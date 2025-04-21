import React from 'react';
import { useData } from '../contexts/DataContext';
import { format } from 'date-fns';

const Gallery = () => {
  const { memories } = useData();
  
  // Get the two most recent memories
  const recentMemories = memories.slice(0, 2);

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-medium text-violet-900 dark:text-violet-200">Gallery</h2>
      {recentMemories.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {recentMemories.map((memory) => (
            <div key={memory.id} className="relative">
              <img
                src={memory.photo}
                alt={memory.caption}
                className="w-full h-40 object-cover rounded-xl"
              />
              <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                {format(new Date(memory.date), 'MMM d, yyyy')}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-sm">No photos added yet</p>
      )}
    </section>
  );
};

export default Gallery;