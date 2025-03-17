import React from 'react';
import { Plus } from 'lucide-react';

const PhotoGroups = () => {
  const groups = [
    {
      id: 1,
      title: 'paintings',
      photos: [
        'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&h=300&fit=crop',
        'https://images.unsplash.com/photo-1577083552431-6e5fd01988f7?w=500&h=300&fit=crop',
      ]
    },
    {
      id: 2,
      title: 'paintings',
      photos: [
        'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&h=300&fit=crop',
        'https://images.unsplash.com/photo-1577083552431-6e5fd01988f7?w=500&h=300&fit=crop',
      ]
    }
  ];

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <div key={group.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-2 gap-0.5">
            {group.photos.map((photo, index) => (
              <img
                key={index}
                src={photo}
                alt={`${group.title} ${index + 1}`}
                className="w-full aspect-square object-cover"
              />
            ))}
          </div>
          <div className="px-3 py-2 flex justify-between items-center border-t">
            <span className="text-sm text-gray-900">{group.title}</span>
            <Plus className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PhotoGroups;