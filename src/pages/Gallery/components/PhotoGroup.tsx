import React from 'react';
import { Plus } from 'lucide-react';

interface Photo {
  id: number;
  urls: string[];
  title: string;
}

const PhotoGroup = () => {
  const photoGroups: Photo[] = [
    {
      id: 1,
      urls: [
        'https://images.unsplash.com/photo-1557166983-5939644443b7?w=500&h=300&fit=crop',
        'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=500&h=300&fit=crop'
      ],
      title: 'First Trimester'
    },
    {
      id: 2,
      urls: [
        'https://images.unsplash.com/photo-1576473353338-d7eb731b3724?w=500&h=300&fit=crop',
        'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&h=300&fit=crop'
      ],
      title: 'Second Trimester'
    }
  ];

  return (
    <div className="space-y-6">
      {photoGroups.map((group) => (
        <div key={group.id} className="bg-white rounded-2xl p-4">
          <div className="grid grid-cols-2 gap-2 mb-2">
            {group.urls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`${group.title} ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
            ))}
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-900">{group.title}</span>
            <Plus className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PhotoGroup;