import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Exercises = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const exercises = [
    {
      image: "https://www.nourishmovelove.com/wp-content/uploads/2022/09/side-body-stretches-yoga-poses-for-pregnancy-scaled.jpg",
      title: "Prenatal Yoga",
      duration: "20 mins",
      level: "Beginner"
    },
    {
      image: "https://images.pexels.com/photos/3875222/pexels-photo-3875222.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      title: "Gentle Stretching",
      duration: "15 mins",
      level: "Beginner"
    },
    {
      image: "https://images.pexels.com/photos/7990613/pexels-photo-7990613.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      title: "Walking",
      duration: "30 mins",
      level: "All Levels"
    },
    {
      image: "https://images.pexels.com/photos/5889957/pexels-photo-5889957.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      title: "Swimming",
      duration: "25 mins",
      level: "Intermediate"
    }
  ];

  // Randomly shuffle exercises on component mount
  React.useEffect(() => {
    const shuffledIndex = Math.floor(Math.random() * (exercises.length - 3));
    setCurrentSlide(shuffledIndex);
  }, []);

  const visibleExercises = exercises.slice(currentSlide, currentSlide + 3);
  const canSlideLeft = currentSlide > 0;
  const canSlideRight = currentSlide < exercises.length - 3;

  const nextSlide = () => {
    if (canSlideRight) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (canSlideLeft) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  return (
    <section className="space-y-3 mb-20">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-violet-900 dark:text-violet-200">Exercises</h2>
        <button 
          onClick={() => navigate('/recommendations')}
          className="flex items-center gap-2 text-violet-600 dark:text-violet-400 hover:underline"
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      
      <div className="relative">
        <div className="overflow-hidden">
          <div
            className="flex gap-4 transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(-${currentSlide * (100 / 3)}%)`,
              width: `${(exercises.length / 3) * 100}%`
            }}
          >
            {exercises.map((exercise, index) => (
              <div
                key={index}
                className="flex-shrink-0"
                style={{ width: `${100 / exercises.length}%` }}
              >
                <ExerciseCard {...exercise} />
              </div>
            ))}
          </div>
        </div>

        {canSlideLeft && (
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg text-violet-600 dark:text-violet-400"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {canSlideRight && (
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg text-violet-600 dark:text-violet-400"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </section>
  );
};

const ExerciseCard = ({ image, title, duration, level }) => (
  <div className="flex-shrink-0 w-full">
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