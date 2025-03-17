import React from 'react';

const Recipes = () => {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-medium text-violet-900 dark:text-violet-200">Recipe Recommendations</h2>
      <div className="relative">
        <div className="flex space-x-4 overflow-x-auto pb-4">
          <RecipeCard
            image="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500&h=300&fit=crop"
            title="Healthy Breakfast Bowl"
          />
          <RecipeCard
            image="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=300&fit=crop"
            title="Nutrient-Rich Salad"
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

const RecipeCard = ({ image, title }) => (
  <div className="flex-shrink-0 w-48">
    <img
      src={image}
      alt={title}
      className="w-full h-32 object-cover rounded-xl"
    />
    <h3 className="mt-2 text-sm font-medium text-violet-900 dark:text-violet-200">{title}</h3>
  </div>
);

export default Recipes;