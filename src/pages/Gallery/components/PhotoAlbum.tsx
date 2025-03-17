import React from 'react';
import { Plus } from 'lucide-react';

const PhotoAlbum = () => {
  const albums = [
    {
      id: 1,
      title: 'First Trimester',
      photos: [
        'https://images.unsplash.com/photo-1557166983-5939644443b7?w=500&h=300&fit=crop',
        'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=500&h=300&fit=crop',
      ]
    },
    {
      id: 2,
      title: 'Second Trimester',
      photos: [
        'https://images.unsplash.com/photo-1576473353338-d7eb731b3724?w=500&h=300&fit=crop',
        'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&h=300&fit=crop',
      ]
    }
  ];

  return (
    <div className="space-y-4">
      {albums.map((album) => (
        <div key={album.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-2 gap-0.5">
            {album.photos.map((photo, index) => (
              <img
                key={index}
                src={photo}
                alt={`${album.title} ${index + 1}`}
                className="w-full aspect-square object-cover"
              />
            ))}
          </div>
          <div className="px-3 py-2 flex justify-between items-center border-t">
            <span className="text-sm text-gray-900">{album.title}</span>
            <Plus className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PhotoAlbum;