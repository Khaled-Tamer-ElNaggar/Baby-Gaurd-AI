import React from 'react';
import Header from '../../components/Header';
import Navbar from '../../components/Navbar';
import PregnancyMilestone from './components/PregnancyMilestone';
import RecipeRecommendations from './components/RecipeRecommendations';
import ExerciseSection from './components/ExerciseSection';
import DailyHealthLog from './components/DailyHealthLog';

const Wellness = () => {
  return (
    <div className="min-h-screen bg-violet-50 dark:bg-gray-900">
      <Header title="Wellness & Tracking" showChildSelector />

      <main className="max-w-lg mx-auto p-4 pb-24 space-y-6">
        <PregnancyMilestone />
        <RecipeRecommendations />
        <ExerciseSection />
        <DailyHealthLog />
      </main>

      <Navbar />
    </div>
  );
};

export default Wellness;