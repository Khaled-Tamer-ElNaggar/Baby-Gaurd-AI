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

  const username = JSON.parse(localStorage.getItem('userData')).username;

  return (
    <div className="min-h-screen bg-violet-50 dark:bg-gray-900">
      <Header title="Home" showChildSelector />

      <main className="p-4 md:p-6 max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Welcome Card - Full width on mobile, 8 columns on large screens */}
          <div className="lg:col-span-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm">
              <h2 className="text-lg font-medium text-violet-900 dark:text-violet-200">
                Welcome back, {username}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {currentChild 
                  ? `Tracking ${currentChild.name}'s journey`
                  : user.user_type === 'pregnant' 
                    ? 'Track your pregnancy journey'
                    : 'Monitor your baby\'s growth'}
              </p>
            </div>
          </div>

          {/* Health Overview - Full width on mobile, 4 columns on large screens */}
          <div className="lg:col-span-4">
            <HealthOverview />
          </div>

          {/* Appointments - Full width on mobile, 6 columns on large screens */}
          <div className="lg:col-span-6">
            <Appointments />
          </div>

          {/* Gallery - Full width on mobile, 6 columns on large screens */}
          <div className="lg:col-span-6">
            <Gallery />
          </div>

          {/* Recipes - Full width on mobile, 12 columns on large screens */}
          <div className="lg:col-span-12">
            <Recipes />
          </div>

          {/* Exercises - Full width on mobile, 12 columns on large screens */}
          <div className="lg:col-span-12">
            <Exercises />
          </div>
        </div>
      </main>

      <Navbar />
    </div>
  );
};

export default Home;