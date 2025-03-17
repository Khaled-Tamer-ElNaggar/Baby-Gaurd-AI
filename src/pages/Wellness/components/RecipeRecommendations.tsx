import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const RecipeRecommendations = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
      <h2 className="text-lg font-medium text-violet-900 dark:text-violet-200 mb-3">
        Recipe Recommendations
      </h2>
      <div className="relative">
        <div className="flex space-x-4 overflow-x-auto pb-4">
          <RecipeCard
            image="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500&h=300&fit=crop"
            title="Healthy Breakfast Bowl"
            description="Rich in folate and iron"
          />
          <RecipeCard
            image="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=300&fit=crop"
            title="Nutrient-Rich Salad"
            description="Perfect for lunch"
          />
        </div>
        <div className="absolute top-1/2 -left-4 transform -translate-y-1/2">
          <button className="p-2 bg-white dark:bg-gray-700 rounded-full shadow-lg">
            <ChevronLeft className="w-5 h-5 text-violet-600 dark:text-violet-400" />
          </button>
        </div>
        <div className="absolute top-1/2 -right-4 transform -translate-y-1/2">
          <button className="p-2 bg-white dark:bg-gray-700 rounded-full shadow-lg">
            <ChevronRight className="w-5 h-5 text-violet-600 dark:text-violet-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

const RecipeCard = ({ image, title, description }) => (
  <div className="flex-shrink-0 w-48">
    <img
      src={image}
      alt={title}
      className="w-full h-32 object-cover rounded-xl"
    />
    <h3 className="mt-2 font-medium text-violet-900 dark:text-violet-200">{title}</h3>
    <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
  </div>
);

export default RecipeRecommendations;