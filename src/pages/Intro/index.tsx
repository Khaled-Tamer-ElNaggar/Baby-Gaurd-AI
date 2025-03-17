import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Baby, Heart, Calendar, MessageSquare, Image, Activity } from 'lucide-react';

const Intro = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Baby className="w-8 h-8" />,
      title: "Child Growth Tracking",
      description: "Monitor your baby's development milestones"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Health Monitoring",
      description: "Track vaccinations and daily health activities"
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Appointment Management",
      description: "Keep track of important medical visits"
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "AI Chat Support",
      description: "Get instant answers to your parenting questions"
    },
    {
      icon: <Image className="w-8 h-8" />,
      title: "Memory Gallery",
      description: "Capture and store precious moments"
    },
    {
      icon: <Activity className="w-8 h-8" />,
      title: "Wellness Tracking",
      description: "Personalized exercise and nutrition guidance"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 pt-20 pb-32 text-center">
        <div className="animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-violet-900 dark:text-violet-200 mb-6">
            Your Journey to 
            <span className="text-violet-600 dark:text-violet-400"> Motherhood </span>
            Starts Here
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            Supporting mothers through pregnancy and early parenthood with comprehensive tracking, 
            guidance, and memories that last a lifetime.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="px-8 py-4 bg-violet-600 text-white rounded-full text-lg font-medium
                     hover:bg-violet-700 transform hover:scale-105 transition-all duration-300
                     shadow-lg hover:shadow-xl dark:bg-violet-500 dark:hover:bg-violet-600"
          >
            Start Your Journey
          </button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-lg
                         transform hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-violet-600 dark:text-violet-400 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-violet-900 dark:text-violet-200 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Intro;