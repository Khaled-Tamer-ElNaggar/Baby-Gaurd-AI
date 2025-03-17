import React from 'react';

const ExerciseSection = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
      <h2 className="text-lg font-medium text-violet-900 dark:text-violet-200 mb-3">
        Recommended Exercises
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <ExerciseCard
          image="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&h=300&fit=crop"
          title="Prenatal Yoga"
          duration="20 mins"
        />
        <ExerciseCard
          image="https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=500&h=300&fit=crop"
          title="Gentle Stretching"
          duration="15 mins"
        />
      </div>
    </div>
  );
};

const ExerciseCard = ({ image, title, duration }) => (
  <div className="bg-violet-50 dark:bg-gray-700 rounded-xl overflow-hidden">
    <img
      src={image}
      alt={title}
      className="w-full h-32 object-cover"
    />
    <div className="p-3">
      <h3 className="font-medium text-violet-900 dark:text-violet-200">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{duration}</p>
    </div>
  </div>
);

export default ExerciseSection;