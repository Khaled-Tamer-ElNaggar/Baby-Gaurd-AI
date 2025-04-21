import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, Users } from 'lucide-react';

const Recipes = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const recipes = [
    {
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500&h=300&fit=crop",
      title: "Healthy Breakfast Bowl",
      time: "15 mins",
      servings: 1,
      nutrition: "High in fiber & protein"
    },
    {
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=300&fit=crop",
      title: "Nutrient-Rich Salad",
      time: "20 mins",
      servings: 2,
      nutrition: "Rich in iron & vitamins"
    },
    {
      image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=500&h=300&fit=crop",
      title: "Quinoa Power Bowl",
      time: "25 mins",
      servings: 2,
      nutrition: "High in protein"
    },
    {
      image: "https://images.unsplash.com/photo-1543352634-99a5d50ae78e?w=500&h=300&fit=crop",
      title: "Omega-3 Rich Salmon",
      time: "30 mins",
      servings: 2,
      nutrition: "Rich in healthy fats"
    },
    {
      image: "https://images.unsplash.com/photo-1495214783159-3503fd1b572d?w=500&h=300&fit=crop",
      title: "Berry Smoothie Bowl",
      time: "10 mins",
      servings: 1,
      nutrition: "High in antioxidants"
    },
    {
      image: "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=500&h=300&fit=crop",
      title: "Avocado Toast",
      time: "10 mins",
      servings: 1,
      nutrition: "Healthy fats & fiber"
    }
  ];

  const slidesPerView = window.innerWidth >= 1024 ? 3 : 2;
  const totalSlides = Math.ceil(recipes.length / slidesPerView);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-medium text-violet-900 dark:text-violet-200">Recipe Recommendations</h2>
      <div className="relative">
        <div className="flex space-x-4 overflow-hidden">
          <div
            className="flex space-x-4 transition-transform duration-300"
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
            }}
          >
            {recipes.map((recipe, index) => (
              <RecipeCard key={index} {...recipe} />
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

const RecipeCard = ({ image, title, time, servings, nutrition }) => (
  <div className="flex-shrink-0 w-48">
    <div className="relative">
      <img
        src={image}
        alt={title}
        className="w-full h-32 object-cover rounded-xl"
      />
      <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded flex items-center justify-between">
        <div className="flex items-center">
          <Clock className="w-3 h-3 mr-1" />
          {time}
        </div>
        <div className="flex items-center">
          <Users className="w-3 h-3 mr-1" />
          {servings}
        </div>
      </div>
    </div>
    <div className="mt-2">
      <h3 className="font-medium text-violet-900 dark:text-violet-200">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{nutrition}</p>
    </div>
  </div>
);

export default Recipes;