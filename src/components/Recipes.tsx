import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Recipes = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const recipes = [
    {
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500&h=300&fit=crop",
      title: "Healthy Breakfast Bowl",
      time: "15 mins",
      nutrition: "High in fiber & protein"
    },
    {
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=300&fit=crop",
      title: "Nutrient-Rich Salad",
      time: "20 mins",
      nutrition: "Rich in iron & vitamins"
    },
    {
      image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=500&h=300&fit=crop",
      title: "Quinoa Power Bowl",
      time: "25 mins",
      nutrition: "High in protein"
    },
    {
      image: "https://images.unsplash.com/photo-1543352634-99a5d50ae78e?w=500&h=300&fit=crop",
      title: "Omega-3 Rich Salmon",
      time: "30 mins",
      nutrition: "Rich in healthy fats"
    }
  ];

  // Randomly shuffle recipes on component mount
  React.useEffect(() => {
    const shuffledIndex = Math.floor(Math.random() * (recipes.length - 3));
    setCurrentSlide(shuffledIndex);
  }, []);

  const visibleRecipes = recipes.slice(currentSlide, currentSlide + 3);
  const canSlideLeft = currentSlide > 0;
  const canSlideRight = currentSlide < recipes.length - 3;

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
        <h2 className="text-lg font-medium text-violet-900 dark:text-violet-200">Recipe Recommendations</h2>
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
              width: `${(recipes.length / 3) * 100}%`
            }}
          >
            {recipes.map((recipe, index) => (
              <div
                key={index}
                className="flex-shrink-0"
                style={{ width: `${100 / recipes.length}%` }}
              >
                <RecipeCard {...recipe} />
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

const RecipeCard = ({ image, title, time, nutrition }) => (
  <div className="flex-shrink-0 w-full">
    <div className="relative">
      <img
        src={image}
        alt={title}
        className="w-full h-32 object-cover rounded-xl"
      />
      <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
        {time}
      </div>
    </div>
    <div className="mt-2">
      <h3 className="font-medium text-violet-900 dark:text-violet-200">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{nutrition}</p>
    </div>
  </div>
);

export default Recipes;