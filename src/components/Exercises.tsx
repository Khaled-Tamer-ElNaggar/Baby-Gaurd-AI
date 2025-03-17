import React from 'react';

const Exercises = () => {
  return (
    <section className="space-y-3 mb-20">
      <h2 className="text-lg font-medium text-violet-900 dark:text-violet-200">Exercises</h2>
      <div className="relative">
        <div className="flex space-x-4 overflow-x-auto pb-4 mb-20">
          <ExerciseCard
            image="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&h=300&fit=crop"
            title="Prenatal Yoga"
          />
          <ExerciseCard
            image="https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=500&h=300&fit=crop"
            title="Gentle Stretching"
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-violet-600 dark:bg-violet-400"></div>
          <div className="w-2 h-2 rounded-full bg-violet-200 dark:bg-violet-800"></div>
          <div className="w-2 h-2 rounded-full bg-violet-200 dark:bg-violet-800"></div>
        </div>
      </div>
    </section>
  );
};

const ExerciseCard = ({ image, title }) => (
  <div className="flex-shrink-0 w-48">
    <img
      src={image}
      alt={title}
      className="w-full h-32 object-cover rounded-xl"
    />
    <h3 className="mt-2 text-sm font-medium text-violet-900 dark:text-violet-200">{title}</h3>
  </div>
);

export default Exercises;