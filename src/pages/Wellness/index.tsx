import React from 'react';
import Header from '../../components/Header';
import Navbar from '../../components/Navbar';
import PregnancyMilestone from './components/PregnancyMilestone';
import BabyGrowthCharts from './components/BabyGrowthCharts';
import SleepTracker from './components/SleepTracker';

const Wellness = () => {
  return (
    <div className="min-h-screen bg-violet-50 dark:bg-gray-900">
      <Header title="Wellness & Tracking" showChildSelector />

      <main className="p-4 md:p-6 max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Section: Milestone and Sleep */}
          <div className="lg:col-span-4 space-y-6">
            <PregnancyMilestone />
            <SleepTracker />
          </div>

          {/* Right Section: Growth Charts */}
          <div className="lg:col-span-8">
            <BabyGrowthCharts />
          </div>
        </div>
      </main>

      <Navbar />
    </div>
  );
};

export default Wellness;