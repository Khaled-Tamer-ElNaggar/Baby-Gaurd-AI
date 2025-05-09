import React, { useState } from 'react';
import Header from '../../components/Header';
import Navbar from '../../components/Navbar';
import { Play, X } from 'lucide-react';

interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  videoUrl: string;
  category: 'mother' | 'baby';
  duration: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface Exercise {
  id: string;
  title: string;
  description: string;
  image: string;
  videoUrl: string;
  category: 'mother' | 'baby';
  duration: string;
  intensity: 'low' | 'medium' | 'high';
}

const Recommendations = () => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'recipes' | 'exercises'>('recipes');

  const recipes: Recipe[] = [
    {
      id: '1',
      title: 'Nutrient-Rich Smoothie Bowl',
      description: 'Perfect for nursing mothers, packed with vitamins and minerals',
      image: 'https://images.unsplash.com/photo-1495214783159-3503fd1b572d?w=800&h=600&fit=crop',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      category: 'mother',
      duration: '10 mins',
      difficulty: 'easy'
    },
    {
      id: '2',
      title: "Baby's First Puree",
      description: 'Gentle introduction to solid foods for babies',
      image: 'https://images.pexels.com/photos/5421510/pexels-photo-5421510.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      category: 'baby',
      duration: '15 mins',
      difficulty: 'easy'
    },
    {
      id: '3',
      title: 'Iron-Rich Lentil Soup',
      description: 'Essential nutrients for pregnancy and postpartum',
      image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&h=600&fit=crop',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      category: 'mother',
      duration: '30 mins',
      difficulty: 'medium'
    },
    {
      id: '4',
      title: 'Omega-3 Rich Salmon Bowl',
      description: 'Brain-boosting nutrients for pregnancy',
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=600&fit=crop',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      category: 'mother',
      duration: '25 mins',
      difficulty: 'medium'
    },
    {
      id: '5',
      title: 'Calcium-Packed Breakfast',
      description: 'Essential for bone health during pregnancy',
      image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&h=600&fit=crop',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      category: 'mother',
      duration: '15 mins',
      difficulty: 'easy'
    },
    {
      id: '6',
      title: 'Sweet Potato Baby Mash',
      description: 'Nutrient-rich first food for babies',
      image: 'https://images.pexels.com/photos/5718107/pexels-photo-5718107.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      category: 'baby',
      duration: '20 mins',
      difficulty: 'easy'
    },
    {
      id: '7',
      title: 'Protein-Rich Quinoa Bowl',
      description: 'Complete protein source for pregnancy',
      image: 'https://images.unsplash.com/photo-1543352634-99a5d50ae78e?w=800&h=600&fit=crop',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      category: 'mother',
      duration: '25 mins',
      difficulty: 'medium'
    },
    {
      id: '8',
      title: 'Avocado Baby Food',
      description: 'Healthy fats for baby development',
      image: 'https://images.unsplash.com/photo-1546554137-f86b9593a222?w=800&h=600&fit=crop',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      category: 'baby',
      duration: '10 mins',
      difficulty: 'easy'
    },
    {
      id: '9',
      title: 'Folate-Rich Spinach Salad',
      description: 'Essential nutrients for fetal development',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      category: 'mother',
      duration: '15 mins',
      difficulty: 'easy'
    },
    {
      id: '10',
      title: 'Banana Oatmeal for Baby',
      description: 'Fiber-rich breakfast for growing babies',
      image: 'https://images.unsplash.com/photo-1495214783159-3503fd1b572d?w=800&h=600&fit=crop',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      category: 'baby',
      duration: '12 mins',
      difficulty: 'easy'
    },
    {
      id: '11',
      title: 'Pregnancy Power Bowl',
      description: 'Complete meal with essential nutrients',
      image: 'https://images.unsplash.com/photo-1546554137-f86b9593a222?w=800&h=600&fit=crop',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      category: 'mother',
      duration: '20 mins',
      difficulty: 'medium'
    },
    {
      id: '12',
      title: 'Veggie-Rich Baby Puree',
      description: 'Colorful mix of vegetables for babies',
      image: 'https://images.pexels.com/photos/7469386/pexels-photo-7469386.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      category: 'baby',
      duration: '25 mins',
      difficulty: 'medium'
    },
    {
      id: '13',
      title: 'Pregnancy Protein Smoothie',
      description: 'Quick protein boost for busy moms',
      image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&h=600&fit=crop',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      category: 'mother',
      duration: '5 mins',
      difficulty: 'easy'
    },
    {
      id: '14',
      title: 'Apple Cinnamon Baby Food',
      description: 'Naturally sweet treat for babies',
      image: 'https://images.pexels.com/photos/9999969/pexels-photo-9999969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      category: 'baby',
      duration: '15 mins',
      difficulty: 'easy'
    },
    {
      id: '15',
      title: 'Pregnancy Energy Bites',
      description: 'Healthy snacks for pregnancy cravings',
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=600&fit=crop',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      category: 'mother',
      duration: '30 mins',
      difficulty: 'medium'
    }
  ];

  const exercises: Exercise[] = [
    {
      id: '1',
      title: 'Prenatal Yoga Flow',
      description: 'Gentle stretches safe for pregnancy',
      image: 'https://www.nourishmovelove.com/wp-content/uploads/2022/09/side-body-stretches-yoga-poses-for-pregnancy-scaled.jpg',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      category: 'mother',
      duration: '20 mins',
      intensity: 'low'
    },
    {
      id: '2',
      title: 'Baby Tummy Time',
      description: 'Essential exercises for baby development',
      image: 'https://images.pexels.com/photos/3875222/pexels-photo-3875222.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      category: 'baby',
      duration: '10 mins',
      intensity: 'low'
    },
    {
      id: '3',
      title: 'Pregnancy Walking',
      description: 'Safe cardio for expecting mothers',
      image: 'https://images.pexels.com/photos/7990613/pexels-photo-7990613.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      category: 'mother',
      duration: '30 mins',
      intensity: 'low'
    },
    {
      id: '4',
      title: 'Baby Leg Exercises',
      description: 'Gentle movements for baby strength',
      image: 'https://images.pexels.com/photos/5889957/pexels-photo-5889957.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      category: 'baby',
      duration: '15 mins',
      intensity: 'low'
    },
    {
      id: '5',
      title: 'Pregnancy Ball Exercises',
      description: 'Core stability and balance',
      image: 'https://www.nourishmovelove.com/wp-content/uploads/2023/03/pregnancy-ball-exercises-hip-opener-scaled.jpg',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      category: 'mother',
      duration: '25 mins',
      intensity: 'medium'
    },
    {
      id: '6',
      title: 'Baby Rolling Practice',
      description: 'Help baby develop rolling skills',
      image: 'https://images.ctfassets.net/6m9bd13t776q/7iuE7aecN0TooIxmVUA9Sz/49c53dded53e5006e056b13c00c9b112/when-does-baby-roll-over-hero-shutterstock_368430671.png?fm=webp&q=90',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      category: 'baby',
      duration: '10 mins',
      intensity: 'low'
    },
    {
      id: '7',
      title: 'Pregnancy Stretching',
      description: 'Relieve pregnancy discomfort',
      image: 'https://www.mayoclinic.org/-/media/kcms/gbs/patient-consumer/images/2013/08/26/09/58/hq00302_im04525_mcdc7_backstretch_pgthu_jpg.jpg',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      category: 'mother',
      duration: '15 mins',
      intensity: 'low'
    },
    {
      id: '8',
      title: 'Baby Crawling Prep',
      description: 'Exercises to encourage crawling',
      image: 'https://images.ctfassets.net/4h8s6y60f7sb/75LdHVIih4k4EcoIFsMfBQ/aa9da26b0c5dabf70996f7be66461de5/NEW_Blog_Headers__29_.jpg?w=1440&fm=avif&q=90',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      category: 'baby',
      duration: '20 mins',
      intensity: 'low'
    },
    {
      id: '9',
      title: 'Pregnancy Swimming',
      description: 'Low-impact water exercises',
      image: 'https://i0.wp.com/post.healthline.com/wp-content/uploads/2020/03/pregnant-pool-swimming-1296x728-header.jpg?w=1155&h=1528',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      category: 'mother',
      duration: '30 mins',
      intensity: 'medium'
    },
    {
      id: '10',
      title: 'Baby Sitting Practice',
      description: 'Help baby develop sitting skills',
      image: 'https://i0.wp.com/blog.lovevery.com/wp-content/uploads/2023/08/Blog_Sitting_A-1-e1691158352621.jpg?w=2048&ssl=1',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      category: 'baby',
      duration: '15 mins',
      intensity: 'low'
    },
    {
      id: '11',
      title: 'Pregnancy Pilates',
      description: 'Safe core strengthening',
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=600&fit=crop',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      category: 'mother',
      duration: '25 mins',
      intensity: 'medium'
    },
    {
      id: '12',
      title: 'Baby Standing Support',
      description: 'Exercises for standing preparation',
      image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&h=600&fit=crop',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      category: 'baby',
      duration: '20 mins',
      intensity: 'low'
    },
    {
      id: '13',
      title: 'Pregnancy Meditation',
      description: 'Mindful movement and breathing',
      image: 'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=800&h=600&fit=crop',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      category: 'mother',
      duration: '15 mins',
      intensity: 'low'
    },
    {
      id: '14',
      title: 'Baby Balance Games',
      description: 'Fun exercises for coordination',
      image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&h=600&fit=crop',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      category: 'baby',
      duration: '10 mins',
      intensity: 'low'
    },
    {
      id: '15',
      title: 'Pregnancy Strength',
      description: 'Safe resistance training',
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=600&fit=crop',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      category: 'mother',
      duration: '30 mins',
      intensity: 'medium'
    }
  ];

  return (
    <div className="min-h-screen bg-violet-50 dark:bg-gray-900">
      <Header title="Recommendations" />

      <main className="p-4 md:p-6 max-w-screen-xl mx-auto pb-24">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('recipes')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'recipes'
                ? 'bg-violet-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300'
            }`}
          >
            Recipes
          </button>
          <button
            onClick={() => setActiveTab('exercises')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'exercises'
                ? 'bg-violet-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300'
            }`}
          >
            Exercises
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === 'recipes' ? (
            recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onPlay={() => setSelectedVideo(recipe.videoUrl)}
              />
            ))
          ) : (
            exercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                onPlay={() => setSelectedVideo(exercise.videoUrl)}
              />
            ))
          )}
        </div>
      </main>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="relative w-full max-w-3xl bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75 z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-video">
              <iframe
                src={selectedVideo}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      <Navbar />
    </div>
  );
};

const RecipeCard = ({ recipe, onPlay }: { recipe: Recipe; onPlay: () => void }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm">
    <div className="relative aspect-video">
      <img
        src={recipe.image}
        alt={recipe.title}
        className="w-full h-full object-cover"
      />
      <button
        onClick={onPlay}
        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity"
      >
        <Play className="w-12 h-12 text-white" />
      </button>
    </div>
    <div className="p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="px-2 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 text-xs rounded-full">
          {recipe.category === 'mother' ? 'For Mother' : 'For Baby'}
        </span>
        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
          {recipe.duration}
        </span>
      </div>
      <h3 className="font-medium text-violet-900 dark:text-violet-200 mb-1">
        {recipe.title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {recipe.description}
      </p>
    </div>
  </div>
);

const ExerciseCard = ({ exercise, onPlay }: { exercise: Exercise; onPlay: () => void }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm">
    <div className="relative aspect-video">
      <img
        src={exercise.image}
        alt={exercise.title}
        className="w-full h-full object-cover"
      />
      <button
        onClick={onPlay}
        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity"
      >
        <Play className="w-12 h-12 text-white" />
      </button>
    </div>
    <div className="p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="px-2 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 text-xs rounded-full">
          {exercise.category === 'mother' ? 'For Mother' : 'For Baby'}
        </span>
        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
          {exercise.duration}
        </span>
      </div>
      <h3 className="font-medium text-violet-900 dark:text-violet-200 mb-1">
        {exercise.title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {exercise.description}
      </p>
    </div>
  </div>
);

export default Recommendations;