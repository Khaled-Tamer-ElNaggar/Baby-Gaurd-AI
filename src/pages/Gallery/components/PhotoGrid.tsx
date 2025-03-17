import React from 'react';
import { Plus } from 'lucide-react';

const PhotoGrid = () => {
  const photos = [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1557166983-5939644443b7?w=500&h=500&fit=crop',
      title: 'First Ultrasound'
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&h=500&fit=crop',
      title: 'Baby Shower'
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1576473353338-d7eb731b3724?w=500&h=500&fit=crop',
      title: 'Nursery Setup'
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=500&h=500&fit=crop',
      title: 'Baby Items'
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {photos.map((photo) => (
        <div key={photo.id} className="relative">
          <img
            src={photo.url}
            alt={photo.title}
            className="w-full aspect-square object-cover rounded-xl"
          />
          <p className="absolute bottom-2 left-2 text-white text-sm font-medium">
            {photo.title}
          </p>
        </div>
      ))}
      <button className="aspect-square border-2 border-dashed border-violet-300 rounded-xl flex items-center justify-center text-violet-400 hover:bg-violet-50">
        <Plus className="w-8 h-8" />
      </button>
    </div>
  );
};

export default PhotoGrid;