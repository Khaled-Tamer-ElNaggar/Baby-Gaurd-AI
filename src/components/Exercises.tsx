import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Exercises = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const exercises = [
    {
      image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&h=300&fit=crop",
      title: "Prenatal Yoga",
      duration: "20 mins",
      level: "Beginner"
    },
    {
      image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=500&h=300&fit=crop",
      title: "Gentle Stretching",
      duration: "15 mins",
      level: "Beginner"
    },
    {
      image: "https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=500&h=300&fit=crop",
      title: "Walking",
      duration: "30 mins",
      level: "All Levels"
    },
    {
      image: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500&h=300&fit=crop",
      title: "Swimming",
      duration: "25 mins",
      level: "Intermediate"
    },
    {
      image: "https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=500&h=300&fit=crop",
      title: "Pilates",
      duration: "20 mins",
      level: "Intermediate"
    },
    {
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop",
      title: "Breathing Exercises",
      duration: "10 mins",
      level: "All Levels"
    }
  ];

  const slidesPerView = window.innerWidth >= 1024 ? 3 : 2;
  const totalSlides = Math.ceil(exercises.length / slidesPerView);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <section className="space-y-3 mb-20">
      <h2 className="text-lg font-medium text-violet-900 dark:text-violet-200">Exercises</h2>
      <div className="relative">
        <div className="flex space-x-4 overflow-hidden">
          <div
            className="flex space-x-4 transition-transform duration-300"
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
            }}
          >
            {exercises.map((exercise, index) => (
              <ExerciseCard key={index} {...exercise} />
            ))}
          </div>
        </div>

        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg text-violet-600 dark:text-violet-400"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg text-violet-600 dark:text-violet-400"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-1">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                currentSlide === index
                  ? 'bg-violet-600 dark:bg-violet-400'
                  : 'bg-violet-200 dark:bg-violet-800'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const ExerciseCard = ({ image, title, duration, level }) => (
  <div className="flex-shrink-0 w-48">
    <div className="relative">
      <img
        src={image}
        alt={title}
        className="w-full h-32 object-cover rounded-xl"
      />
      <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
        {duration}
      </div>
    </div>
    <div className="mt-2">
      <h3 className="font-medium text-violet-900 dark:text-violet-200">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{level}</p>
    </div>
  </div>
);

export default Exercises;