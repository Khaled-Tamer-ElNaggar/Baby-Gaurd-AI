import React from 'react';
import Header from '../components/Header';
import HealthOverview from '../components/HealthOverview';
import Appointments from '../components/Appointments';
import Gallery from '../components/Gallery';
import Recipes from '../components/Recipes';
import Exercises from '../components/Exercises';
import Navbar from '../components/Navbar';
import { useUser } from '../contexts/UserContext';

const Home = () => {
  const { user, currentChild } = useUser();

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-violet-50 dark:bg-gray-900">
      <Header title="Home" showChildSelector />

      <main className="max-w-lg mx-auto p-4 space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm">
          <h2 className="text-lg font-medium text-violet-900 dark:text-violet-200">
            Welcome back, {user.full_name}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {currentChild 
              ? `Tracking ${currentChild.name}'s journey`
              : user.user_type === 'pregnant' 
                ? 'Track your pregnancy journey'
                : 'Monitor your baby\'s growth'}
          </p>
        </div>

        <HealthOverview />
        <Appointments />
        <Gallery />
        <Recipes />
        <Exercises />
      </main>

      <Navbar />
    </div>
  );
};

export default Home;