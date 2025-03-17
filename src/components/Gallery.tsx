import React from 'react';

const Gallery = () => {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-medium text-violet-900 dark:text-violet-200">Gallery</h2>
      <div className="grid grid-cols-2 gap-3">
        <img
          src="https://images.unsplash.com/photo-1519824145371-296894a0daa9?w=500&h=500&fit=crop"
          alt="Ultrasound"
          className="w-full h-40 object-cover rounded-xl"
        />
        <img
          src="https://images.unsplash.com/photo-1584714268709-c3dd9c92b378?w=500&h=500&fit=crop"
          alt="Baby items"
          className="w-full h-40 object-cover rounded-xl"
        />
      </div>
    </section>
  );
};

export default Gallery;